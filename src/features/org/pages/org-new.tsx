import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrganizationSchema, type CreateOrganizationInput } from '../org-schema';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authClient } from '@/features/auth/auth-client';
import { CreateOrgForm } from '../components/org-form';
import { Header } from '@/components/header';
import { ArrowLeft } from 'lucide-react';

export function AddNewOrgPage() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    const form = useForm<CreateOrganizationInput>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: '',
            slug: '',
            logo: '',
        },
    });

    const handleSubmit = async (values: CreateOrganizationInput) => {
        try {
            setIsLoading(true);

            // Call Better Auth organization creation
            await authClient.organization.create({
                name: values.name,
                slug: values.slug,
                logo: values.logo,
            });

            navigate('/', { replace: true });
        } catch (error) {
            console.error('Failed to create organization:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header>
                <div className="flex items-center gap-2">
                    <ArrowLeft
                        onClick={() => navigate(-1)}
                        className="shrink-0"
                        aria-label="Go back"
                        size={24}
                    />
                    <h1 className="text-xl font-bold tracking-tight">Set Up Your Route</h1>
                </div>
            </Header>

           <div className='pt-16'>
             <CreateOrgForm
                form={form}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
           </div>
        </>
    );
}