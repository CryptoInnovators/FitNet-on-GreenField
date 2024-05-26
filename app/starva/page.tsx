"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const StarvaPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    const scope = searchParams.get('scope');

    const [athlete, setAthlete] = useState(null);

    const clientId = 127308;
    const clientSecret = '3b2aa6c474545071ee13382447ca7618c4545007';
    const refresh_token = localStorage.getItem('refresh_token');
    const access_token = localStorage.getItem('access_token');

    const authorize = () => {
        const res = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.NEXT_PUBLIC_STARVA_REDIRECT_URI}&response_type=code&scope=activity:read_all`;
        window.location.href = res;
    };

    const generateTokenByCode = async (code) => {
        console.log(refresh_token, access_token);

        if (refresh_token || access_token) return;

        try {

            const body = JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
            };

            const res = await fetch('https://www.strava.com/oauth/token', options);
            const response = await res.json();

            console.log("Response >>> ", response)

            if (res.status === 200) {
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem('access_token', response.access_token);
                setAthlete(response.athlete);
            } else {
                console.error('Failed to exchange token', response);
            }
        } catch (error) {
            console.error('Error >>>', error);
        }
    };

    useEffect(() => {
        if (code) {
            localStorage.setItem('Authorization_code', code);
            console.log("Oauth code:", code);
            generateTokenByCode(code);
        }
    }, [code]);


    //TODO: Call this when the expires_in time crosses the timestamp.
    const getNewTokenByRefreshToken = async () => {
        const authorizationCode = localStorage.getItem('Authorization_code');

        const url = `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${authorizationCode}&grant_type=refresh_token&refresh_token=${refresh_token}`

        const response = await fetch(url);

        console.log("Response >>>>", response);

    }

    return (
        <div>
            <Button onClick={authorize}>Authorize</Button>
            {athlete && <div>Welcome, {athlete.firstname}</div>}
        </div>
    );
};

export default StarvaPage;
