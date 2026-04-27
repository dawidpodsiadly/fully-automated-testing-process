import React, {useState, useEffect, useCallback} from 'react';
import api from '../api/api';
import UserTable from '../components/UsersTable';
import ConfirmDelete from '../components/ConfirmDelete';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import AddUserButton from '../components/AddUserButton';
import LogoutButton from '../components/LogoutButton';
import {dateTimeFormat} from '../utils/date.util';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const cachedPage = sessionStorage.getItem('currentPage');
    return cachedPage ? parseInt(cachedPage) : 1;
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    const cachedItemsPerPage = sessionStorage.getItem('itemsPerPage');
    return cachedItemsPerPage ? parseInt(cachedItemsPerPage) : 5;
  });
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(true);
  const [confirmMassDelete, setConfirmMassDelete] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const response = await api.getAllUsers(startIndex, itemsPerPage);
      const formattedUsers = response.data.map(user => ({
        ...user,
        lastUpdated: dateTimeFormat(user.lastUpdated, true),
      }));
      setUsers(formattedUsers);
    } catch {}
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    sessionStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    setIsDeleteButtonDisabled(selectedUsers.length === 0);
  }, [selectedUsers]);

  const handleToggleActivation = async (userId, isActivated) => {
    try {
      await api.updateUserById(userId, {isActivated: isActivated});
      await fetchData();
    } catch {}
  };

  const handleDelete = id => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const confirmDeleteUser = async id => {
    try {
      await api.deleteUserById(id);
      await fetchData();
      setConfirmDeleteId(null);
    } catch {}
  };

  const handleMassDelete = async () => {
    try {
      setConfirmMassDelete(true);
    } catch {}
  };

  const handleConfirmMassDelete = async () => {
    try {
      await Promise.all(selectedUsers.map(async id => await api.deleteUserById(id)));
      await fetchData();
      setSelectedUsers([]);
      setConfirmMassDelete(false);
    } catch {}
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const handleCheckboxChange = id => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, id]);
    }
    setIsDeleteButtonDisabled(selectedUsers.length === 0);
  };

  const handleSearchTermChange = term => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(
    user =>
      `${user.name} ${user.surname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="vh-100" style={{backgroundColor: '#fff'}}>
      <div
        id="users-table-header"
        className="d-flex justify-content-between align-items-center"
        style={{padding: '1rem 0.5rem 0.1rem'}}
      >
        <div style={{paddingRight: '10px'}}>
          <h2>User Management</h2>
          <SearchBar
            id="search-input"
            searchTerm={searchTerm}
            setSearchTerm={handleSearchTermChange}
            style={{width: '40rem'}}
          />
        </div>
        <div className="d-flex align-items-center">
          <div style={{marginRight: '10px'}}>
            <AddUserButton id="add-user-button" />
          </div>
          <div>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end" style={{padding: '0rem 0rem 2rem 0rem'}}>
        <button
          id="user-table-delete-selected-users-button"
          onClick={handleMassDelete}
          className={`btn btn-danger me-2 ${isDeleteButtonDisabled ? 'disabled' : ''}`}
          disabled={isDeleteButtonDisabled}
          style={{
            fontSize: '14px',
            marginTop: '20px',
            backgroundColor: isDeleteButtonDisabled ? '#ccc' : undefined,
            cursor: isDeleteButtonDisabled ? 'not-allowed' : undefined,
            border: isDeleteButtonDisabled ? 'none' : undefined,
          }}
        >
          Delete selected Users
        </button>
        <Pagination
          id="pagination"
          currentPage={currentPage}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
        />
      </div>
      <UserTable
        users={paginatedUsers}
        handleDelete={handleDelete}
        onCheckboxChange={handleCheckboxChange}
        selectedUsers={selectedUsers}
        handleToggleActivation={handleToggleActivation}
      />
      {confirmDeleteId && (
        <ConfirmDelete
          onCancel={cancelDelete}
          onConfirm={() => confirmDeleteUser(confirmDeleteId)}
          onDelete={handleDelete}
        />
      )}
      {confirmMassDelete && (
        <ConfirmDelete
          onCancel={() => setConfirmMassDelete(false)}
          onConfirm={handleConfirmMassDelete}
          onDelete={handleDelete}
          isMassDelete={true}
        />
      )}
    </div>
  );
}

export default UsersPage;
