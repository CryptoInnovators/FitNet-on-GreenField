"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ProfileContainer from '@/components/ProfileContainer';
import TasksData from '@/components/TasksData';

const StarvaPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    const scope = searchParams.get('scope');

    const [athlete, setAthlete] = useState(null);

    const clientId = 127308;
    const clientSecret = '3b2aa6c474545071ee13382447ca7618c4545007';
    const refresh_token = localStorage.getItem('starva:refresh_token');
    const access_token = localStorage.getItem('starva:access_token');

    const [isLoading, setIsLoading] = useState(code ? false : true);
    const [needsAuthorization, setNeedsAuthorization] = useState(false);

    const authorize = () => {
        const res = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${process.env.NEXT_PUBLIC_STARVA_REDIRECT_URI}&response_type=code&scope=activity:write,activity:read_all`;
        window.location.href = res;
    };

    const generateTokenByCode = async (code) => {
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
            console.log("Response >>> ", res, response)

            if (res.status === 200) {
                localStorage.setItem('starva:refresh_token', response.refresh_token);
                localStorage.setItem('starva:access_token', response.access_token);
                setAthlete(response.athlete);
                getAthleteStats(response.athelete.id);
                setIsLoading(false);
                setNeedsAuthorization(false);
            } else {
                console.error('Failed to exchange token', response);
            }
        } catch (error) {
            console.error('Error >>>', error);
        }
    };

    useEffect(() => {
        const codeFromStorage = localStorage.getItem('starva:Authorization_code');
        if (code && codeFromStorage != code) {
            localStorage.setItem('starva:Authorization_code', code);
            generateTokenByCode(code);
        }

        if (code && access_token && refresh_token) {
            getAuthenticatedAthlete();
        }

    }, [code, access_token, refresh_token]);

    const getAuthenticatedAthlete = async () => {
        const access_token = localStorage.getItem('starva:access_token');

        if (access_token) {
            try {
                const url = "https://www.strava.com/api/v3/athlete";

                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                };

                const res = await fetch(url, options);
                const response = await res.json();

                if (res.status === 200) {
                    setAthlete(response);
                    getAthleteStats(response.id)
                }
            } catch (error) {
                console.log("Error in getting athlete data", error);
            }
        }
    }


    const [athleteStats, setAthleteState] = useState();

    const getAthleteStats = async (id) => {
        const access_token = localStorage.getItem('starva:access_token');

        if (access_token) {
            try {
                const athelet_id = id
                const url = `https://www.strava.com/api/v3/athletes/${athelet_id}/stats`

                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                };

                const res = await fetch(url, options);
                const response = await res.json();

                if (res.status == 200) {
                    setAthleteState(response);
                }
            } catch (error) {
                console.log("Error in getting athlete state", error);
            }
        }
    }


    return (
        <div className='px-12 py-12 flex flex-col'>

            <div className='flex flex-col gap-2'>
                <h2 className="text-5xl font-bold tracking-tight">Athlete Profile Section</h2>
                {!code && <h3 className="text-lg text-muted-foreground">Please Authorize your Starva Account to continue.</h3>}
            </div>


            <div className='flex justify-end gap-4'>
                {/* {!code && <Button onClick={authorize}>Authorize</Button>} */}
                <Button onClick={authorize}>Authorize</Button>
                <Button onClick={getAuthenticatedAthlete}>Get Athlete Details</Button>
            </div>

            {athlete && <h2 className="text-5xl px-12 font-bold tracking-tight">Welcome, {athlete?.firstname}</h2>}

            <ProfileContainer isLoading={isLoading} athleteData={athlete} />

            {athlete && <TasksData taskData={athleteStats} athlete={athlete} />}


        </div>
    );
};

export default StarvaPage;
