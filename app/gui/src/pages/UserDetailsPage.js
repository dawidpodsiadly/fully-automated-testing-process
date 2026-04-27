import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import apis from '../api/api';
import {dateTimeFormat} from '../utils/date.util';
import BackButton from '../components/BackButton';
import LogoutButton from '../components/LogoutButton';

function UserDetailsPage() {
  const {id} = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apis.getUserById(id);
        setUserData(response.data);
      } catch {}
    };

    fetchUserData();

    return () => {
      setUserData(null);
    };
  }, [id]);

  return (
    <div id="user-details-form" className="container mt-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <BackButton />
          <h2 className="mb-0 ms-2">User Details</h2>
        </div>
        {!userData?.isAdmin && <LogoutButton />}
      </div>
      {userData && (
        <div className="card">
          <div className="card-body">
            <p id="user-details-name">
              <strong>Name:</strong> {userData.name}
            </p>
            <p id="user-details-surname">
              <strong>Surname:</strong> {userData.surname}
            </p>
            <p id="user-details-email">
              <strong>Email:</strong> {userData.email}
            </p>
            <p id="user-details-phone-number">
              <strong>Phone Number:</strong> {userData.phoneNumber || '-'}
            </p>
            <p id="user-details-birth-date">
              <strong>Birth Date:</strong> {userData.birthDate ? dateTimeFormat(userData.birthDate) : '-'}
            </p>
            <p id="user-details-contract-type">
              <strong>Contract Type:</strong> {userData.contract?.type || '-'}
            </p>
            <p id="user-details-salary">
              <strong>Salary:</strong> {userData.contract?.salary || '-'}
            </p>
            <p id="user-details-position">
              <strong>Position:</strong> {userData.contract?.position || '-'}
            </p>
            <p id="user-details-start-time">
              <strong>Start Time:</strong>{' '}
              {userData.contract?.startTime ? dateTimeFormat(userData.contract.startTime) : '-'}
            </p>
            <p id="user-details-end-time">
              <strong>End Time:</strong> {userData.contract?.endTime ? dateTimeFormat(userData.contract.endTime) : '-'}
            </p>
            <p id="user-details-notes">
              <strong>Notes:</strong> {userData.notes || '-'}
            </p>
            <p id="user-details-admin">
              <strong>Admin:</strong> {userData.isAdmin ? 'Yes' : 'No'}
            </p>
            <p id="user-details-activated">
              <strong>Activated:</strong> {userData.isActivated ? 'Yes' : 'No'}
            </p>
            <p id="user-details-last-updated">
              <strong>Last Updated:</strong> {userData.lastUpdated ? dateTimeFormat(userData.lastUpdated, true) : '-'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetailsPage;
