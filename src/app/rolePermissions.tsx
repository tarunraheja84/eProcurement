'use client';
import { Permissions } from '@/utils/helperFrontendFunctions';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { ReactNode, useEffect, useState } from 'react';
import Loading from './loading';

interface Props {
  children: ReactNode;
}

const RolePermissions = (props: Props) => {
  const [rolePermissions, setRolePermissions] = useState({});

  const fetchPermissions = async () => {
    try {
      const newPermissions = await axios.get('/api/settings/internalUserRolePermissions');
      setRolePermissions(newPermissions.data.permissions);
    } catch (error) {
      console.log('error  :>> ', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const { data: session } = useSession();

  if (!session) {
    return <Loading />;
  }

  return (
    <Permissions.Provider value={{ rolePermissions, setRolePermissions }}>
      {props.children}
    </Permissions.Provider>
  );
};


export default RolePermissions;
