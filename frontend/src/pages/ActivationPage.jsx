import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { server } from '../server';
import axios from 'axios'
const ActivationPage = () => {
    const [error, setError] = useState(false);
    const { activation_token } = useParams();

    useEffect(() => {
        if(activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axios.post(`${server}/user/activation`,{
                        activation_token
                    })
                    console.log("error: ", res)
                    // setError(false);
                } catch (error) {
                    setError(true);
                }                
            }
            activationEmail()
        }
    }, [activation_token])
    
  return (
    <div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    }}>
        {
            error ? (
                <p>Your token is expired</p>
            ) : (
                <p>Your account is created successfully</p>
            )
        }
    </div>
  )
}

export default ActivationPage