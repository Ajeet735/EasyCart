import React, {  useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../../main";

const AdminRoute = ({Children}) => {

    const {isAuthorized, user} = useContext(Context);

    if(!isAuthorized){
        return <Navigate to="/login" replace/>
    }

    if(user?.role !== "Admin") {
        return <Navigate to ="/" replace />
    }
    return Children
}

export default AdminRoute