import ProjectForm from '../_components/ProjectForm';

export default function NewProjectPage() {
  return (
    <ProjectForm
      title="Add Project"
      description="Create a new initiative and control how it appears on the public projects page."
      initialData={{
        title: '',
        description: '',
        category: 'General',
        imageUrl: '',
        status: 'active',
        sortOrder: 0,
      }}
    />
  );
}
