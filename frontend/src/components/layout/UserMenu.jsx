const UserMenu = ({ user, onLogout, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
      <div className="px-4 py-2 border-b">
        <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
      <button 
        onClick={onLogout}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign Out
      </button>
    </div>
  )
}

export default UserMenu
