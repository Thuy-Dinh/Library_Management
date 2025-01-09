import React, { useState, useEffect } from "react";
import { ComfirmApi } from "../../api/account";

export default function Confirm() {
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        async function confirmAccount() {
            try {
                const data = await ComfirmApi();
                setMessage(data.message);
            } catch (error) {
                console.error('Error during confirmation:', error.response ? error.response.data : error.message);
            }
        }
    
        confirmAccount();
    }, []);

    return (
        <div>
            {message}
        </div>
    );
}
