import BoardMemberForm from '../_components/BoardMemberForm';

export default function NewBoardMemberPage() {
  return (
    <BoardMemberForm
      title="Add Board Member"
      description="Create a new leadership profile for the governance page."
      initialData={{
        name: '',
        role: '',
        bio: '',
        imageUrl: '',
        sortOrder: 0,
      }}
    />
  );
}
