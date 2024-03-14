'use client';
import { Permissions } from '@/utils/helperFrontendFunctions';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { ReactNode, useEffect, useState } from 'react';
import Loading from './loading';
import { UserType } from '@/types/enums';
import { getUserSessionData } from '@/utils/utils';

interface Props {
  children: ReactNode;
}

const RolePermissions = (props: Props) => {
  const [rolePermissions, setRolePermissions] = useState({});
  const sessionData: UserSession | undefined = useSession().data?.user;
  const isVendorLogin = sessionData?.userType === UserType.VENDOR_USER ? true : false

  const fetchPermissions = async () => {
    try {
      const newPermissions = await axios.get(`/api/settings/${isVendorLogin ? "vendorUserRolePermissions" : "internalUserRolePermissions"}`);
      console.log(newPermissions.data.permissions)
      setRolePermissions(newPermissions.data.permissions);
    } catch (error) {
      console.log('error  :>> ', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [sessionData]);

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
