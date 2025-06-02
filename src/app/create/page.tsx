'use client'; 
import {useState} from 'react'; 
import {useRouter} from 'next/navigation'; 
import {auth} from '../lib/firebase'; 
import {savePlan} from '../lib/firestore'; 

import Layout from '../components/Layout';
import {Box, Button, Card, CardContent, TextField, Typography} from '@mui/material'; 


export default function CreatePlanPage(){
    const [planName, setPlanName] = useState(''); 
    const [error, setError] = useState(''); 
    const router = useRouter(); 


    const handleCreate = async () => {
        const user = auth.currentUser; 
        if(!user) return router.push('/login'); 

        if(!planName.trim()){
            setError("Plan name is required."); 
            return;
        } 

        try{
            await savePlan(user.uid, planName, []); 
            router.push('/home');
        } catch(e){
            console.error('Failed to create plan', e); 
            setError('Failed to create plan. Please try again.')
        }
    }; 

    return (
        <Layout> 
            <Box className = "max-w-xl mx-auto mt-12"> 
                <Card> 
                    <CardContent> 
                        <Typography variant="h5" gutterBottom>
                            Create a New Course Plan
                        </Typography> 
                        <TextField
                            fullWidth
                            label="Plan Name"
                            value={planName}
                            onChange={(e) => setPlanName(e.target.value)} 
                            error={!!error}
                            helperText={error}
                            sx={{mb: 2}}
                        /> 
                        <Button 
                            fullWidth
                            variant='contained'
                            color='primary'
                            onClick={handleCreate}
                        >
                            Create Plan
                        </Button>

                    </CardContent>
                </Card>
            </Box>
        </Layout>
    )
}