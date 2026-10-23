import { clsx } from 'clsx';
import { CreateNoteFormData } from '@/core';
import { Error } from './Error';
import { Fieldset } from './Fieldset';
import { IconKey, IconWorld } from '@tabler/icons-react';
import { InputPassword } from './InputPassword';
import { InputRadio } from './InputRadio';
import { Label } from './Label';
import { Legend } from './Legend';
import { useWatch } from 'react-hook-form';

export const EncryptionFieldset = (props: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) => {

    const needsEncryption = useWatch<CreateNoteFormData>({ name: 'encrypted' }) === 'true';

    return (
        <>
            <Fieldset
                {...props}
                className='p-2 pb-4 rounded-md border dark:border-middark border-midlight'
            >
                <Legend tip='(opcional)'>Criptografia</Legend>
                <InputRadio id='encryptedFalse' name='encrypted' value='false' defaultChecked />
                <Label htmlFor='encryptedFalse' icon={IconWorld} className='cursor-pointer mr-3'>Não</Label>
                <InputRadio id='encryptedTrue' name='encrypted' value='true' />
                <Label htmlFor='encryptedTrue' icon={IconKey} className='cursor-pointer'>Sim</Label>
            </Fieldset>
            <Fieldset
                className={clsx(
                    'relative overflow-hidden',
                    '-mt-1 pl-6 ',
                    'border-l dark:border-middark border-midlight',
                    'origin-top-left transition-transform',
                    needsEncryption
                        ? 'scale-100 h-fit'
                        : 'scale-0 h-0',
                )}
            >
                <Label htmlFor='passphrase' tip='*' className='block'>Segredo</Label>
                <InputPassword name='passphrase' className='my-1' />
                <Error field='passphrase' />
            </Fieldset>
        </>
    )

}