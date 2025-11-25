
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
  Grid,
  Avatar,
} from "@mui/material";

import FaceIcon from '@mui/icons-material/Face';
import { FaCamera } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { porfileImgeupload } from "../../Api/apiService";
import toast from "react-hot-toast";
const DashProfile = () => {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log('Address => ',user);

  const handleImageChange = async (e) => {
    const token = user?.token;
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      setLoading(true); // Start loading indicator

      try {
        const response = await porfileImgeupload('/agent/profileImage', formData, token);
        console.log("response = > ", response);
        // Update the state with the returned image URL
        if (response && response.status === 200) {
          toast.success(response?.message);
          setProfileImage(response?.image);
          setLoading(false);
        } else {
          setProfileImage('');
          setLoading(false);
        }
      } catch (err) {
        // setError("Image upload failed. Please try again.");
      } finally {
        setLoading(false); // End loading indicator
      }
    }
  };


  useEffect(()=>{
    setProfileImage(user?.users && user?.users?.image);
  },[])

  if (loading) {
    return (
      <div className="container text-center py-5">
        <h3>Loading, please wait...</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <Box>
      {/* Profile Card */}
      <Card sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center', boxShadow: 4, borderRadius: 4 }}>
        <Box sx={{ position: 'relative', mr: 3 }}>
          <Avatar
            src={profileImage}
            sx={{
              width: 100,
              height: 100,
              fontSize: 40,
              fontWeight: 'bold',
              bgcolor: '#90caf9',
            }}
          >
            {!profileImage && <FaceIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <IconButton
            size="small"
            onClick={() => fileInputRef.current.click()}
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: '#fff',
              border: '1px solid #ccc',
              '&:hover': { bgcolor: '#eee' },
            }}
          >
            <FaCamera />
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </Box>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {user && user?.users && user?.users.name ? `${user.users.name} ${user.users.lastName}` : 'Sunil Narine'}
          </Typography>
          <Typography color="text.secondary">Agent</Typography>
          <Typography color="text.secondary">{user && user?.users?.user_detail?.state_name || 'Nangloe'}, {user && user?.users?.user_detail?.country_name || 'India'}</Typography>
        </Box>
      </Card>

      {/* Personal Information */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
          Personal Information
        </Typography>
        <Grid container spacing={3}>
          {[
            ['First Name', user?.users?.name || 'Natashia'],
            ['Last Name', user?.users?.lastName || 'Khaleira'],
            ['Date of Birth', user?.users?.dob || '12-10-1990'],
            ['Email Address', user?.users?.email || 'info@binary-fusion.com'],
            ['Phone Number', user?.users?.phone || '(+62) 821 2554-5846'],
            ['User Role', 'Agent'],
          ].map(([label, value], idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Typography color="text.secondary" fontSize={14}>
                {label}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Address */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
          Address
        </Typography>
        <Grid container spacing={3}>
          {[
            ['Country', user?.users?.user_detail?.country_name || 'India'],
            ['State', user?.users?.user_detail?.state_name || 'Delhi'],
            ['City', user?.users?.user_detail?.city_name || 'Subhash Nagar'],
            ['Address', user?.users?.user_detail?.registered_address || 'Subhash Nagar'],
            ['Postal Code', user?.users?.user_detail?.postal_code || '11-00-86'],
          ].map(([label, value], idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Typography color="text.secondary" fontSize={14}>
                {label}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Documents */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
          Documents Details
        </Typography>
        <Grid container spacing={3}>
          {[
            ['Pan Number', user?.users?.kyc_detail?.pan_card_number || 'GTUS64457E'],
            ['Aadhaar Number', user?.users?.kyc_detail?.aadhar_card_number || '6044-8558-6252'],
            ['Gst Number', user?.users?.kyc_detail?.gst_number || '27ABCDE1234F1Z5'],
          ].map(([label, value], idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Typography color="text.secondary" fontSize={14}>
                {label}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};

export default DashProfile