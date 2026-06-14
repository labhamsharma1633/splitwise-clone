function GroupCard({ group, onClick }) {
  return (
    <button className="group-card" type="button" onClick={onClick}>
      <h2>{group.name}</h2>
      <p>{group.description || 'No description'}</p>
    </button>
  )
}

export default GroupCard
