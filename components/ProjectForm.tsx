'use client'

import { useState } from 'react'
import { ProjectInterface, SessionInterface } from '@/common.types'
import Image from 'next/image'
import FormField from './FormField'
import { categoryFilters } from '@/constant'
import CustomMenu from './CustomMenu'
import Button from './Button'
import { createNewProject, fetchToken, updateProject } from '@/lib/actions'
import { useRouter } from 'next/navigation'

type Props = {
    type: string
    session: SessionInterface
    project?: ProjectInterface
}

const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter()

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSubmitting(true)

        const { token } = await fetchToken()

        try {
            if (type === 'create') {
                // create project
                await createNewProject(form, session?.user?.id, token)

                router.push('/')
            }

            if (type === 'edit') {
                // edit project
                await updateProject(form, project?.id as string, token)

                router.push('/')
            }
        } catch (error) {
            console.log(error)
            alert(
                `Failed to ${
                    type === 'create' ? 'create' : 'edit'
                } a project. Try again!`
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        const file = e.target.files?.[0]

        if (!file) return

        if (!file.type.includes('image')) {
            return alert('Please upload an image file')
        }

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result as string
            handleStateChange('image', result)
        }
    }

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevState) => ({ ...prevState, [fieldName]: value }))
    }
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [form, setForm] = useState({
        title: project?.title || '',
        description: project?.description || '',
        image: project?.image || '',
        liveSiteUrl: project?.liveSiteUrl || '',
        githubUrl: project?.githubUrl || '',
        category: project?.category || '',
    })

    return (
        <form onSubmit={handleFormSubmit} className='flexStart form'>
            <div className='flexStart form_image-container'>
                <label htmlFor='poster' className='flexCenter form_image-label'>
                    {!form.image && 'Choose a poster for your project'}
                </label>
                <input
                    id='image'
                    type='file'
                    accept='image/*'
                    required={type === 'create'}
                    className='form_image-input'
                    onChange={handleChangeImage}
                />
                {form.image && (
                    <Image
                        src={form?.image}
                        className='sm:p-10 object-contain z-20'
                        alt='Project poster'
                        fill
                    />
                )}
            </div>
            <FormField
                title='Title'
                state={form.title}
                placeholder='Flexibble'
                setState={(value) => handleStateChange('title', value)}
            />
            <FormField
                title='Description'
                state={form.description}
                placeholder='Showcase and discover remarkable developer projects.'
                setState={(value) => handleStateChange('description', value)}
                isTextArea={true}
            />
            <FormField
                type='url'
                title='Website URL'
                state={form.liveSiteUrl}
                placeholder='https://jsmastery.pro'
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />
            <FormField
                type='url'
                title='GitHub URL'
                state={form.githubUrl}
                placeholder='https://github.com/adrianhajdin'
                setState={(value) => handleStateChange('githubUrl', value)}
            />
            <CustomMenu
                title='Category'
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />
            <div className='flexStart w-full'>
                <Button
                    title={
                        isSubmitting
                            ? `${type === 'create' ? 'Creating' : 'Editing'}`
                            : `${type === 'create' ? 'Create' : 'Edit'}`
                    }
                    type='submit'
                    leftIcon={isSubmitting ? '' : '/plus.svg'}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    )
}

export default ProjectForm
