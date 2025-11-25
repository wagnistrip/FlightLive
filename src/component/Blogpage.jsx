
import React, { useEffect, useState } from 'react'
import Offer from './Offer'
import Footer from './Footer'
import axios from 'axios';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoadingPage from '../LoadingPage';
import { getImageUrl } from '../utils/airlineUtils';

const Blogpage = () => {
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(9);
  const [loadingcompon, setloadingcompon] = useState(false);
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };
  const handleNext = () => {
    if (page < lastPage) {
      setloadingcompon(true);
      setPage(prev => prev + 1);
      setTimeout(() => {
        setloadingcompon(false);
      }, 500);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setloadingcompon(true);
      setPage(prev => prev - 1);
      setTimeout(() => {
        setloadingcompon(false);
      }, 500);
    }
  };



  const fetchBlog = async (pageNumber = 1) => {
    try {
      const response = await axios.get(`https://blog.wagnistrip.com/api/blogs-All?page=${pageNumber}`, {
        withCredentials: false,
      });

      if (response.status === 200) {
        const blogData = response.data.blog;
        setBlogs(blogData.data);
        setTotal(blogData.total);
        setLastPage(blogData.last_page);
        setPerPage(blogData.per_page);
      }
      // setBlog(blogDatad); 
    } catch (err) {
      console.error("fetch blog error", err);
    }
  };
  useEffect(() => {
    fetchBlog(page);
  }, [page])

  return (
    <>
      {loadingcompon && (
        <LoadingPage />
      )}
    
      <Offer title="Latest travel blogs" />

      <div className='container'>
        <div>
          <FeaturedBlog />

          <Grid container spacing={5} mt={4}>
            {blogs && blogs?.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <BlogCard post={post} stripHtml={stripHtml} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination UI */}
          <Box display="flex" justifyContent="flex-end" alignItems="center" mt={4}>
            <Typography variant="body2" mr={2}>
              {(page - 1) * perPage + 1} -{' '}
              {Math.min(page * perPage, total)} of {total}
            </Typography>
            <IconButton onClick={handlePrev} disabled={page === 1}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={handleNext} disabled={page === lastPage}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Blogpage
const BlogCard = ({ post, stripHtml }) => (
  // [0].images[0].image_path
  <Link 
        href={`https://blog.wagnistrip.com/blog/${post?.slug}`}
        underline="none"
        color="inherit"
        target="_blank"
        rel="noopener noreferrer"
  >
  <Card
    onClick={() =>
      window.open(`https://blog.wagnistrip.com/blog/${post?.slug}`, '_blank')
    }
    sx={{
      borderRadius: 3,
      boxShadow: 'none',
      transition: 'box-shadow 0.3s ease-in-out',
      '&:hover': {
        boxShadow: 6,
      },
    }}
  >
    <Box sx={{ overflow: 'hidden' }}>
      <CardMedia
        component="img"
        image={`https://blog.wagnistrip.com/public/storage/${post?.images?.[0]?.image_path}`}
        alt={post.title}
        sx={{
          height: 300,
          width: '100%',
          objectFit: 'cover', // Ensures image covers the area while maintaining aspect ratio
          transition: 'transform 0.4s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          cursor: 'pointer',
        }}
      />
    </Box>
    <CardContent>

      <Typography
        underline="none"
        color="inherit"
        sx={{
          fontWeight: 600,
          fontSize: '1.1rem',
          display: 'inline-block',
          mb: 1,
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {post?.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {post?.description
          ? stripHtml(post.description).slice(0, 60) +
          (stripHtml(post.description).length > 60 ? '...' : '')
          : ''}
      </Typography>
      <Box sx={{ display: 'none', alignItems: 'center', gap: 1 }}>
        <Avatar src={`https://randomuser.me/api/portraits/women/${post.id || 1}.jpg`} sx={{ width: 36, height: 36 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {"Raushan"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <span style={{ color: '#7C3AED' }}>{new Date(post.published_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}</span> •{' '}
            {/* {post.created_at} */}
            {/* {dayjs(post.created_at).fromNow() }"Raushan" */}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
  </Link>

);



const FeaturedBlog = () => {
  const slug = (text) => text.replace(/\s+/g, '-');
  return (
    <Box mt={10} sx={{ px: 0, py: 0 }}>
      {/* Featured Card */}
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 0,
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: 0,
          },
        }}
      >
        {/* Image */}
        <Box
          sx={{
            width: { xs: '100%', md: '60%' },
            overflow: 'hidden',
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            // borderRadius="7px"
            image={getImageUrl("cheapplacestop.png")}
            alt="Blog"
            sx={{
              height: '100%',
              objectFit: 'cover',
              borderRadius: '10px'
            }}
          />
        </Box>

        {/* Text */}
        <CardContent sx={{ width: { xs: '100%', md: '40%' }, p: 3 }}>
          <Typography
            color="inherit"
            sx={{
              fontWeight: 700,
              fontSize: '1.5rem',
              display: 'inline-block',
              mb: 1,
              cursor: 'default', // <-- Correct way to set cursor

            }}
          >
            Cheap Places to Travel in the World
          </Typography>


          <Typography variant="body2" textAlign="justify" color="text.secondary" sx={{ mb: 2 }}>
            Traveling must be a great adventure for some people living in the world, and they feel a great energy in themselves when they travel to new cities. And for all the people who love travelling, we have come up with a list of the cheapest places to travel in the world.No matter which place you are travelling to with family or solo, we always have a mindset of saving money from every trip so that we can use the remaining amount for our future trips, and let me remind you, there are numerous places that you can visit on a budget.
          </Typography>

          <Link
            href={`/tour-details/${slug("Cheap Places to Travel in the World")}`}
            underline="hover"
            color="#7C3AED"
            sx={{ fontWeight: 600 }}
          >
            Read full article →
          </Link>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <Avatar
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="Melisa Campbell"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Melisa Campbell</Typography>
              <Typography variant="caption" color="text.secondary">
                <span style={{ color: '#7C3AED' }}>26 Feb 2025</span> • 8 min read
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};