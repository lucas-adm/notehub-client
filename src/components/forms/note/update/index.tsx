import { ApiError } from '@/api';
import { clsx } from 'clsx';
import { createNoteUpdateFormSchema, encrypt, handleFieldErrors, Note, NoteUpdateFormData, Token } from '@/core';
import { createNoteUpdateFormSchemaRefined } from '@/core/schemas/note/UpdateNote';
import { Element } from './elements';
import { FormProvider, useForm } from 'react-hook-form';
import { forwardRef, useMemo, useState } from 'react';
import { useApi, useNotes, useTags } from '@/data/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onPortalClose?: () => void;
    closeRef?: React.RefObject<HTMLButtonElement>;
    token: Token | null;
    passphrase: string | null;
    setPassphrase: React.Dispatch<React.SetStateAction<string | null>>;
    note: Note;
    setNote: React.Dispatch<React.SetStateAction<Note | null>>;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(({ onPortalClose, closeRef, token, passphrase, setPassphrase, note, setNote, ...rest }, ref) => {

    const {
        noteService: { updateNote },
        withProgress
    } = useApi();
    const qc = useQueryClient();

    const { notes, updateNote: updateNoteContext } = useNotes();
    const { setNewTags } = useTags();

    const schema = useMemo(() =>
        createNoteUpdateFormSchema(
            note.user ? note.user.username : 'user',
            (notes ?? []).filter((n) => n.id !== note.id).map((n) => n.name),
        ),
        [note.user, note.id, notes]
    )

    const refinedSchema = useMemo(() =>
        createNoteUpdateFormSchemaRefined(
            note.user ? note.user.username : 'user',
            (notes ?? []).filter((n) => n.id !== note.id).map((n) => n.name),
        ),
        [note.user, note.id, notes]
    )

    const updateNoteForm = useForm<NoteUpdateFormData>({
        resolver: zodResolver(refinedSchema),
        defaultValues: {
            encrypted: note.encrypted,
            markdown: note.markdown,
        },
        mode: 'onChange',
    })

    const { handleSubmit, setError } = updateNoteForm;

    const [isPending, setIsPending] = useState<boolean>(false);

    const router = useRouter();

    const onSubmit = async (data: NoteUpdateFormData): Promise<void> => {
        if (token && note.user) {
            if (note.encrypted) if (!passphrase) return setError(
                'passphrase',
                { message: 'Descriptografe a nota.' },
            )
            try {
                setIsPending(true);
                const { passphrase, ...rest } = data;
                const payload = rest.encrypted
                    ? { ...rest, markdown: await encrypt(rest.markdown ?? '', passphrase!) }
                    : rest;
                await withProgress(() => updateNote(token.access_token, note.id, payload));
                await Promise.all([
                    qc.invalidateQueries({ queryKey: ['userNotes', token.access_token] }),
                    qc.invalidateQueries({ queryKey: ['userTags', token.access_token] }),
                    qc.invalidateQueries({ queryKey: ['searchNotes'] }),
                    qc.invalidateQueries({ queryKey: ['searchTags'] }),
                    qc.invalidateQueries({ queryKey: ['note', token.access_token, note.user.username, note.name] })
                ])
                if (data.passphrase) setPassphrase(data.passphrase);
                updateNoteContext(note.id, payload);
                setNewTags(payload.tags);
                setNote(prev => {
                    if (prev) return {
                        ...prev,
                        name: payload.name,
                        description: payload.description,
                        markdown: rest.markdown,
                        tags: payload.tags,
                        closed: payload.closed,
                        hidden: payload.hidden,
                        encrypted: payload.encrypted,
                        modified: true,
                        modified_at: 'now'
                    }
                    return null
                })
                onPortalClose?.();
                return router.push(`/${note.user.username}/${payload.name}`);
            } catch (error) {
                const { data } = error as ApiError;
                if (Array.isArray(data)) handleFieldErrors(data, setError);
            } finally {
                setIsPending(false);
            }
        }
    }

    const { Fieldset, Label, InputText, InputTags, InputPassword, InputCheck, Error, Button } = Element;

    return (
        <FormProvider {...updateNoteForm}>
            <form
                ref={ref}
                onSubmit={handleSubmit(onSubmit)}
                className={clsx(
                    'z-[998] center',
                    'max-w-[500px] w-[95%] mx-auto rounded',
                    'inmd:static inmd:translate-x-0 inmd:translate-y-0',
                    'inmd:max-h-svh inmd:h-svh',
                    'insm:max-w-screen-sm insm:w-full insm:rounded-none',
                    ' inmd:flex inmd:flex-col',
                    'border dark:border-middark/50 border-midlight/50',
                    'dark:bg-dark bg-light',
                )}
                {...rest}
            >
                <header className='p-4'>
                    <h5>Configure sua nota</h5>
                </header>
                <section className={clsx(
                    'overflow-y-auto overscroll-contain',
                    'scrollbar-desktop inmd:scrollbar-mobile',
                    'max-h-full h-full p-4',
                    'border-y dark:border-middark/50 border-midlight/50',
                    'dark:bg-darker/50 bg-lighter',
                )}>
                    <Fieldset className='relative'>
                        <Label htmlFor='name'>Título</Label>
                        <InputText schema={schema} name='name' defaultValue={note.name} autoFocus />
                        <Error field='name' />
                    </Fieldset>
                    <Fieldset className='relative'>
                        <Label htmlFor='description'>Descrição</Label>
                        <InputText schema={schema} name='description' defaultValue={note.description} />
                        <Error field='description' />
                    </Fieldset>
                    <Fieldset className='relative'>
                        <Label htmlFor='tags'>Tags</Label>
                        <InputTags name='tags' noteTags={note.tags} />
                        <Error field='tags' />
                    </Fieldset>
                    <Fieldset className='relative'>
                        <Label htmlFor='passphrase'>Criptografia</Label>
                        <InputPassword name='passphrase' defaultValue={passphrase ?? undefined} />
                        <Error field='passphrase' />
                    </Fieldset>
                    <Fieldset>
                        <InputCheck name='encrypted' defaultChecked={note.encrypted} />
                        <Label htmlFor='encrypted'>Criptografada</Label>
                    </Fieldset>
                    <Fieldset>
                        <InputCheck name='closed' defaultChecked={note.closed} />
                        <Label htmlFor='closed'>Fechada</Label>
                    </Fieldset>
                    <Fieldset>
                        <InputCheck name='hidden' defaultChecked={note.hidden} />
                        <Label htmlFor='hidden'>Oculta</Label>
                    </Fieldset>
                </section>
                <footer className='p-4 flex items-center gap-3 justify-end'>
                    <Button
                        disabled={isPending}
                        ref={closeRef}
                        type='button'
                        className='hover:dark:bg-black hover:bg-white focus-visible:dark:bg-black focus-visible:bg-white'
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isPending}
                        type='submit'
                        className='text-white bg-primary hover:bg-secondary focus-visible:bg-secondary'
                    >
                        Salvar alteração
                    </Button>
                </footer>
            </form>
        </FormProvider>
    )

})

Form.displayName = 'Form';