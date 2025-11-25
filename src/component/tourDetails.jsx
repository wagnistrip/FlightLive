import React, { useState } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import Offer from './Offer'
import { getImageUrl, travelNewsimg } from '../utils/airlineUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { useMediaQuery } from '@mui/material';
const faqData = [
    {
        question: "Which destinations are considered to be the cheapest places to travel in the world?",
        answer: "Among all the countries, Vietnam is considered to be the cheapest country to travel to in the world."
    },
    {
        question: "Which country is considered to be the best for tourism?",
        answer: "France is in the number one position of the country for tourism."
    },
    {
        question: "In which country can I travel with INR50,000?",
        answer: "Dubai, Vietnam, Sri Lanka, and Thailand are places you can visit with INR50,000."
    },
    {
        question: "Which is the cheapest foreign trip you can go on?",
        answer: "There are many places, but some of the top ones are Sri Lanka, Thailand, Nepal, Malaysia, Laos, Cambodia, and Vietnam."
    },
    {
        question: "Which country is so cheap?",
        answer: "Vietnam is still considered to be the cheapest in the entire world."
    }
];
const faqData1 = [
    {
        question: "What food did you have to try on your Goa trip?",
        answer: "The staple food of Goa is rice and fish curry but basically the place is famous for the seafood which almost most of the people try on their Goa trip."
    },
    {
        question: "What are the challenges faced by people in Goa?",
        answer: "Most of the time it is about cleanliness and about the infrastructure, which is not loved by the people but there are many options available for you which you can choose according to your requirement and likings."
    },
    {
        question: "What attracts people to Goa?",
        answer: "Goa is all over famous for its breathtaking views of the beaches, like sunsets, and also the most loved one is the seafood of the place, and there are so many things that you can try."
    },
    {
        question: "How many beaches are there in Goa?",
        answer: "There are 35 beaches in the entire Goa."
    },
    {
        question: "Which beach is known as the queen of Goa among all other beaches in the entire Goa?",
        answer: "Calangute beach is considered to be the queen of Goa as compared to all other beaches."
    }
];
const faqData2 = [
    {
        question: "Does Spiti Valley open in December?",
        answer: "Yes, the Spiti Valley is open in the month of December, but only through the Shimla route."
    },
    {
        question: "How to go to Spiti Valley from Delhi?",
        answer: "There are various ways you can go to Spiti Valley, for example, by bus, rented car, or bike trip."
    },
    {
        question: "What is the temperature of Spiti Valley in May?",
        answer: "The normal temperature ranges from -14.7 to 0.6 degrees Celsius."
    }
];

const faqData4 = [
    {
        question: "What places to visit in Dubai for free?",
        answer: "The Dubai Fountain is at the top of the list for places to visit in Dubai for free."
    },
    {
        question: "Are all the beaches in Dubai free?",
        answer: "All the beaches in Dubai are free, and you don't have to pay a certain amount to go there and enjoy time with your loved ones."
    },
    {
        question: "Which city is cheaper in Dubai?",
        answer: "Deira is considered the cheapest city in Dubai."
    },
    {
        question: "What are the cheap things to buy in Dubai as a tourist?",
        answer: "It depends on the preferences of the tourist. You can buy various things in Dubai, including electronic goods (which are cheaper than in many other countries), dates, and other local food items."
    },
    {
        question: "What is Dubai Mall famous for?",
        answer: "Dubai Mall is world-famous for its shopping experience, offering a vast selection of international brands and attractions."
    }
];


const TourDetails = () => {
    const navigate = useNavigate();
    const { title } = useParams();
     const isMobile = useMediaQuery("(max-width: 768px)");
    // const currentBlog = travelNewsimg.find((blog) => blog.title === title);
    // Slug function to match route param
    const formattedTitle = title.replace(/-/g, ' ');
    const slug = (text) => text.replace(/\s+/g, '-');

    const currentBlog = travelNewsimg.find((blog) => slug(blog.title) === title);
    const handleClick = (title) => {
        const formattedTitle = slug(title);
        navigate(`/tour-details/${formattedTitle}`);
    };
    return (
        <>
            <Navbar />
            <Offer title={formattedTitle} />
            <section id="news_details_main_arae" className="section_padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="news_detail_wrapper text-justify">

                                {
                                    formattedTitle === 'Top Three Beaches to Experience the Real Goa Night Life' ? (
                                        <div className="news_details_content_area">
                                            <img
                                                style={{ borderRadius: '6px' }}
                                                src={getImageUrl("blogimg.jpg")}
                                                alt="img"

                                            />
                                            <h2 style={{ fontSize: isMobile ? '22px' : '',lineHeight: isMobile ? '34px' : '' }}>Top Three Beaches to Experience the Real Goa Night Life</h2>
                                            <p>
                                                As the summer season came the craze of beaches was on trend. If you are living in India
                                                then Goa will be the most chosen location because it has one of the most mesmerizing
                                                beaches and mouthwatering food, and the most important thing we will talk about today is
                                                <strong className='ml-2'>Goa nightlife</strong>.
                                            </p>
                                            <p>
                                                Goa is already popular for so many things in India Amoung youngsters and couples who want
                                                to invest their time in a trip that is worthy of every penny.
                                            </p>
                                            <p>
                                                The month that is considered to have the best time in Goa is November to February that time
                                                the weather is pleasant, full of festivals, and a very soothing environment.
                                            </p>
                                            <h4 className='my-4'>For your reference, I have given a list of top 3 Goa beaches that will enhance your entire
                                                journey to another extent.</h4>

                                            <h3>Baga Beach,Goa</h3>
                                            <p>
                                                Amoung every
                                                other beach in goa,the baga beach is considered to be the best for goa nightlife.it
                                                has everything what you look for in an exciting trip with your friends and loved

                                                ones.talking about mesmerising beaches, mouth watering foods,and a lot of exciting
                                                activities.Baga beach is also known for the titos lane which is full of bars,resturants
                                                and café.The location is also famous for beach shaks which are basically made up of
                                                bamboo,which serves as a café which you can see only in beachy areas.
                                                Everyone loves shoping and you can go for handmade items used for décor.
                                            </p>

                                            <h3 className='mb-3'>There is a list of resturants and cafe  that is given below for your refrence that will make
                                                you're stay cozy and comfy:</h3>
                                            <ul>
                                                {['Cherry Olive', 'Relish', 'Jamie’s Restaurant', 'Toro Toro', 'Old Bombay', 'Reddish Bar & Restaurant', 'Britto Restaurant', 'Fire Ice', 'Favela Goa'].map((place) => (
                                                    <li key={place}><i className="fas fa-circle" /> {place}</li>
                                                ))}
                                            </ul>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("baga.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("baga2.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className='my-2'>Other than you can also try some of the water sports activities which is hub for all the
                                                youngsters. We made a list of all the activities which you can try in the baga beach:</h4>

                                            <ul>
                                                {['Jet Skiing', 'Parasailing', 'Boat Ride', 'Kayaking', 'Banana Ride'].map((activity) => (
                                                    <li key={activity}><i className="fas fa-circle" /> {activity}</li>
                                                ))}
                                            </ul>



                                            <h3>Candolim Beach</h3>
                                            <p>This Beach is one of the most popular beaches to enjoy the goa nightlife and if you
                                                are a new one who haven’t experienced have any beach experience till now then
                                                visiting this beach will be the best thing for you. The beauty of beach enhances after
                                                the sunset where you can enjoy the peacefulness of the beach. On the other hand, if
                                                you are a party person then goa nightlife will do magic to your night.</p>
                                            <h4 className='my-4'>Some of the resorts and hotels where you can stay in your goa trip is mentioned
                                                below for your reference near the Candolim beach:</h4>


                                            <ul>
                                                {['Acacia Goa', 'Alegria – The Goan Village', 'Fortune Select Regina', 'Godwin Hotel', 'Carmo Lobo Beach Apartment Resort', 'Deltin Suites', '360 Degree Beach Retreat'].map((hotel) => (
                                                    <li key={hotel}><i className="fas fa-circle" /> {hotel}</li>
                                                ))}
                                            </ul>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("cando.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("candolim.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <p>There is a festival which is very popular Amoung the visitors and the people of goa which is
                                                sunburn festivals. The festival happens every year in the month of December. This is one of
                                                the most famous edm festival which include multiple performances, fireworks and many
                                                more.</p>

                                            <h4 className='my-4'>There are various activities which you can try on the beach which are given below for
                                                your reference:</h4>

                                            <ul>
                                                {['Speed Boat Ride', 'Bumper Boat Ride', 'Parasailing', 'Jet Ski', 'Banana Ride'].map((activity) => (
                                                    <li key={activity}><i className="fas fa-circle" /> {activity}</li>
                                                ))}
                                            </ul>


                                            <h3>Anjuna Beach</h3>

                                            <p>The given beach is also one of the most famous beaches in the entire goa. You can
                                                spend your entire goa nightlife in the specific one beach. There is a list of some of
                                                the beach clubs and bars which you can try near anjuna beach.</p>

                                            <ul>
                                                {['Speakeasy Pub at Rosetum', 'Sea Bar', 'Vacasso', 'Nyex Beach Club'].map((club) => (
                                                    <li key={club}><i className="fas fa-circle" /> {club}</li>
                                                ))}
                                            </ul>

                                            <p>
                                                Curlie Beach shack is the most popular Amoung other shacks at anjuna beach, it provides wide range
                                                of staying options. Every Wednesday there is a flea market which is near at anjuna market
                                                where you can buy the old and handmade goods. The important advice while travelling in
                                                goa in any place is always carry water bottle with you as hydration is the majour issue while travelling around beaches.
                                                and we can not take any risks related to our health.
                                            </p>

                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("anjuna.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("anjuna2.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <p>The beach is an ultimate party bomber which starts from night and goes till the sunrise, with
                                                a lot of lighting, multiple lightshows and nonstop dance beats. Just like any other beautiful
                                                beach in goa, anjuna beach has the best water sports activities you can try for an fun
                                                adventure.</p>



                                        </div>

                                    ) : formattedTitle === 'Top Countries to Visit In the Month of Summer' ? (
                                        <div className='news_details_content_area'>
                                            <img
                                                style={{ borderRadius: '6px' }}
                                                src={getImageUrl("topcountriestop.png")}
                                                alt="img"

                                            />
                                            <h2 style={{ fontSize: isMobile ? '22px' : '',lineHeight: isMobile ? '34px' : '' }}>{formattedTitle}</h2>
                                            <p>
                                                There are numerous countries in the world where you can explore and have one of the best
                                                experiences of your life. you do not have to worry about any place as we will discuss where you
                                                can easily spend your summer time with your loved ones. Summer is the time when everyone
                                                wants to stay at a cozy place and have a family time or alone time in beautiful weather. Summer
                                                can be different depending on the place also. we will be discuss in the further sections of the
                                                blog about the <strong className='text-black'>best places to go in summer</strong> and have a beautiful experience there.
                                            </p>
                                            <h3 className='my-2'>For your
                                                reference,We made a list of the top 6 countries that you can visit during the month of summer which is
                                                written below:</h3>
                                            <ul>
                                                {['Switzerland', 'Hamburg, Germany', 'Bali', 'Iceland', 'Bhutan', 'Japan'].map((activity) => (
                                                    <li key={activity}><i className="fas fa-circle" /> {activity}</li>
                                                ))}
                                            </ul>
                                            <p>
                                                The very first location is the place which is also known as the heaven on earth which is none
                                                other than Switzerland. we already know how hot it becomes in some of the countries in the
                                                month of summer where living is almost so irresistible, therefore planning a vacation in the
                                                month of summer to a cold place will be a good idea. Just imagine resting in a house that is
                                                surrounded by snow. Switzerland has the <strong className='text-black'>
                                                    best cities to visit in summer</strong> time. you can try the
                                                world-famous Swiss chocolate there during your trip. there are multiple places where you can
                                                go for a visit like the Rhine Falls where you can experience the waterfalls. Swiss cheese and
                                                chocolate are other things to visit the place, not only in the specific summer but also in any
                                                month of the year. If you are willing to start an exciting adventure then you are in the right spot
                                                as you can try multiple activities there in Switzerland.
                                            </p>
                                            <p>
                                                This is a basic guideline that before visiting Switzerland you must have a Schengen visa and a
                                                passport which is on period not an expiry one so you must check the guidelines before visiting
                                                any country.
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries1.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries2.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                The second location is Hamburg Germany which comes in the list of <strong className='text-black'>good summer vacation
                                                    destinations.</strong> the location is also a trading point to the entire world which also makes the
                                                specific place very popular among other countries. if you want to try something new in your life
                                                you can also visit the multiple places where the beers are made as Germany is well known for
                                                the manufacture of the beers. Whereas a child beer will be a great option to spend your time in
                                                the month of summer. As we visit any country we also think of trying the popular and tasty food
                                                of that country and for Switzerland, it is mashed potatoes. You can also go for dishes like
                                                bratwurst,rouladen and many more.
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries3.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries4.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                The third location is full of islands and beautiful scenery which you guessed right it is bali,
                                                talking about the natural habitat, beautiful scenery, and the activities you can do there are
                                                insane.it is full of mountains, temples, and volcanoes. There are multiple sports activities that
                                                you can try there like scuba diving, banana boat, jet skiing, trekking, and hiking. There are
                                                plenty of water sports activities that these islands are famous for which make them unique and
                                                different from others. You can try eating their native food like babi guling,bebek betutu and sate.
                                                For all the shopaholics it will be the best location for you as you can shop from one corner of the
                                                city to the last with unlimited supplies of all types of souvenirs and materials.
                                            </p>
                                            <p>
                                                The place is full of photogenic places for the best memories It has some of the most beautiful
                                                islands that will take your breath away for a second and you need time to adjust that the place is
                                                real and you are not imagining. this will be the perfect spot for all social media lovers as it will
                                                give you the exact view of the location. On the other hand, there are an enormous number of
                                                volcanoes there and you will get to see these natural phenomena also which can not be seen in
                                                any other normal places thats why it is a great opportunity, to visit Bali as compared to any other
                                                place.
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries5.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries6.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                The fourth location comes under the <strong className='text-black'>best vacation spots in the world</strong> which is Iceland the
                                                place is already well known all around the world and I don&#39;t think so this place needs an
                                                introduction. this place straight comes out of a fairy tale movie. Talking about the natural
                                                wonders this place holds is incredible. visiting the specific location in the month of the summer
                                                is like a cherry on top which will give you an extraordinary experience here. the place has the
                                                northern light and people come from all around the world to see that specific light. It is said that
                                                if you ever visit the location and haven&#39;t been to the Blue Lagoon then your trip is not complete
                                                as it is considered and said to be the most loved and visited location by all the tourists.
                                            </p>
                                            <p>
                                                The place is very well known by the people that it comes in the list of the top places to visit in
                                                the entire world once in your lifetime as the northern light is not a thing which can be seen in
                                                any part of the world.it is very precious and you wil be very lucky if you have seen the whole
                                                scenario with your naked eye. In terms of the food, you can try the fermented sharks which is a
                                                very popular dish there, and consider that if you ever visit Iceland then you must try this.
                                                There are multiple vodka bars and natural hot springs which will remove all your stress and you
                                                will be in heaven after seeing and experiencing all those things in one go.
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries7.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries8.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                The fifth location on our list is Bhutan which is also known as the happiest country in the world If
                                                you also want to be happy then don&#39;t forget to visit Bhutan. By visiting Bhutan you will get to see
                                                the great Himalayas which is a very popular destination among hikers and travelers who want to
                                                experience real adventure in their life with extreme weather conditions. You can visit Tiger Hill,
                                                Thimpu, Punakha, and Pero.
                                            </p>
                                            <p>
                                                You can do various activities there like trekking, visiting multiple monasteries, bungee jumping,
                                                and river rafting. on the other hand in terms of food, you can try ema datsi, momo, and their
                                                most famous red rice in your meals. you can reach the country Bhutan by train also if you love
                                                adventurous and train journeys which would be a fun idea to do so to start any type of trip. thats
                                                why Bhutan is considered to be a <strong className='text-black'>good summer vacation destinations.</strong>
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries9.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries10.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p>
                                                The sixth location on our list is Japan which I think is very familiar to everyone these days due to
                                                the popularity of its ancient culture, anime, Japanese drama, and many more. Japanese ramen
                                                is taking all the attention of youngsters and other people in the whole nation so if you ever think
                                                of visiting Japan then don&#39;t forget to try their native ramen. It does not matter if you are veg or
                                                non-veg. there are various variants available for you. It comes in countries which are far away
                                                from the normal countries as its technical background is so strong it is very hard to beat.
                                            </p>
                                            <p>
                                                There are multiple places that you can visit in Japan like Mount Fuji, Kyoto, Nagasaki, Tokyo,
                                                and Disneyland. Japan is very famous for its cherry blossom, and if you visit Japan in that
                                                month it will be a lucky time for you to see the real Japan&#39;s beauty.
                                            </p>
                                            <h4>You must have in your mind that you have to apply for a Japanese visa before 7-10 days.</h4>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries11.png")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("topcountries12.png")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ) : formattedTitle === 'Best Spiti Valley Tour Guide with itinerary, Destinations, and Travel Advice' ?
                                        (<div className='news_details_content_area'>
                                            <img
                                                style={{ borderRadius: '6px' }}
                                                src={getImageUrl("spititop.jpg")}
                                                alt="img"

                                            />
                                            <h2 style={{ fontSize: isMobile ? '20px' : '28px',lineHeight: isMobile ? '30px' : '' }}>{formattedTitle}</h2>
                                            <p>
                                                Travelling is a great experience, and it also does not matter which place you are travelling to in the world. Now the whole question arises is what places you want to travel to and how you can do that, particularly this blog is about giving you all the information regarding the <strong>Spiti Valley tour,</strong> and all teh things which you can doo in your <strong>spiti valley trip.</strong> Basically <strong>Spiti Valley road</strong> trip is very popular among everyone as it gives you the breathtaking views of all the surrounding monasteries and beautiful scenery.
                                            </p>
                                            <p>
                                                In the future, if you are thinking of going on a <strong>
                                                    Spiti Valley trip</strong> and you are confused about where to start, what activities you can try, what shopping places, and many more things. Then you have landed on the right place, you can because here you will get the detailed <strong>Spiti Valley itinerary</strong> for your future trip. The place is located in the northern region of Himachal Pradesh in the district of Spiti and Lahul.

                                            </p>
                                            <h3 className='my-2'>
                                                What are the paths you can reach in your Spiti Valley Tour?
                                            </h3>
                                            <p>
                                                There are two ways you can start your <strong>Spiti Valley tour,</strong> which are firstly starting your journey from Shimla, and the other one is starting from <strong>Manali to Spiti Valley.</strong> It is mostly said that always start your journey from Shimla, as there are many places between Shimla and you can enjoy more in your whole trip. On the other hand, if you want to skip a long journey, you can take the other route from <strong>Manali to Spiti Valley.</strong>
                                            </p>
                                            <p>
                                                Based on the vehicle you are travelling in also matters, as the <strong>Spiti Valley road trip</strong> is also very popular among youngsters and families, and they often travel with their families. If you are a college student, then there are numerous changes that you have to make to the <strong>Spity Valley road trip,</strong> as road trip excites alot, and in college days, we all traveled to famous locations with our college friends.
                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti3.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti4.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className='my-2'>
                                                Places to Visit in Spiti Valley

                                            </h3>
                                            <p>
                                                We made a list of places that you can visit in your Spiti Valley tour, which is written below for your reference:

                                            </p>
                                            <ul style={{ listStyleType: 'order' }} className='ms-3'>
                                                <li><p>
                                                    <span className='text-black fw-bold'>Chandratal Lake : </span>
                                                    In your Spiti Valley packages, it is like a mandatory place which you will visit, as this place is very famous among tourists and almost everyone visits this place in their Spiti Valley tour. The name of the lake is given due to the half-moon structure and also because of the blue water. The place is a paradise for the people and a perfect spot for the pictures.
                                                </p>
                                                    <p>
                                                        <span className='fw-bold text-black'>Best Month to Travel:</span> The best month to travel to Chandratal Lake in your Spiti Valley tour is June to September; therefore, if you are going for a Spiti Valley tour, then you should visit in the given months.
                                                    </p>
                                                </li>
                                                <li><p>
                                                    <span className='text-black fw-bold'>Key monastery : </span>
                                                    This monastery is famous as being the oldest monastery located in the place, and it is located at the top of the hill at sea level. The monastery is very famous, and people all over the world visit the place, and this place gives peace.
                                                </p>
                                                    <p>
                                                        <span className='fw-bold text-black'>Best Month to travel : </span> The best time to travel is from May to September.
                                                    </p>
                                                </li>
                                                <li><p>
                                                    <span className='text-black fw-bold'>Pin Valley National Park : </span>
                                                    This place is a heaven for all nature lovers, as the place is beautifully surrounded by lush green valleys and gives you a great view of the valley. especially it is popular for the snow leopard. You will also get to see some animals like ibex and blue sheep.

                                                </p>
                                                    <p>
                                                        <span className='fw-bold text-black'>Best Month to Travel : </span> July to october is considered to be the best month for your Spiti Valley tour.

                                                    </p>
                                                </li>
                                                <li><p>
                                                    <span className='text-black fw-bold'>Suraj Tal : </span>
                                                    This place is extremely famous as the highest third ranked lake in india. It gives panoramic views of the mountains and the valley. It is also said by the people that if you take a dip in this holy water, then all your bad sins that you have done in your life will be swept away. The place is also known as Suraj Taal. This place has an aura of peace that will take you away from the hustle and bustle of your city life.

                                                </p>
                                                    <p>
                                                        <span className='fw-bold text-black'>Best Month to Visit : </span> May to october is the finest month to visit this place in your Spiti Valley tour.


                                                    </p>
                                                </li>
                                                <li><p>
                                                    <span className='text-black fw-bold'>Kumzum Pass : </span>
                                                    The location is in the Kumzum region of the Himalayas. Kumzum Pass is a great place for all the road trip lovers, and they would love to drive on this beautiful pass, and it is also one of the highest motorbike passes in india. The location has a great view of the snowy mountains, Spiti mystic glaciers, and many more things, which make it a must-visit place in your Spiti Valley tour.
                                                </p>
                                                    <p>
                                                        <span className='fw-bold text-black'>Best Month to Visit : </span> The best months to visit this place are June to September.


                                                    </p>
                                                </li>

                                            </ul>

                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti1.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti2.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <h4 className='mt-4'>Accommodation Tips for your Spits Valley itinerary</h4>
                                            <p>
                                                This tip will always be useful to you, not only on this trip but on every trip. For example, if you want to book any Spiti Valley hotels or want to book a package or make an itinerary for the trip, make sure you book all of them a month ago or few weeks before as it will be slightly cheaper, or you won't get the higher fare of all the expenses. This is like an all-time hack for you to apply in all kinds of travel journeys.

                                            </p>
                                            <h4 className='mt-4'>
                                                Best Month to Book your Spiti Valley Tour
                                            </h4>
                                            <p>
                                                The best month which is considered to make your Spiti Valley Packages then it is somewhere between june to september and thisis also know as the peak season to visit the place, as all the roads were clear at that time and many vehicles were going on the route to Spiti Valley because in other months the road got block and the local buses wont run. You can also visit in the other months, but the above-mentioned months were considered to be the best ones for your next trip.

                                            </p>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti5.jpg")}

                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="news_details_left_img">
                                                        <img
                                                            src={getImageUrl("spiti6.jpg")}
                                                            alt="img"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className='mt-4'>
                                                Places to Shopping in Spiti Valley
                                            </h4>
                                            <p>There are some very famous places for shopping in Spiti Valley, which are given below for your reference :
                                            </p>
                                            <ul style={{ listStyleType: 'order' }} className='ms-3'>
                                                <li>
                                                    <p><span className='text-black fw-bold'>Kaza Market : </span> Kaza Market is the number one market in terms of shopping on your tour. In this market, you will find various shops that are selling handmade wool stalls, handmade crafts, jewelry, and many more things. This market truly shows you the local culture of the valley, and you can also purchase the pure honey, dry fruits, and spices from here. It's a must-visit place if you want to purchase some souvenirs at the end of the trip and take them home.
                                                    </p>
                                                </li>
                                            </ul>

                                            <h4 className='my-2'>
                                                Things you can shop from the Market
                                            </h4>
                                            <ul style={{ listStyleType: 'order' }} className='ms-4'>
                                                <li>Tibetan handicrafts</li>
                                                <li>Prays flag</li>
                                                <li>Singing bowls</li>
                                                <li>Prayer wheels</li>
                                                <li>Spiti Valley jewelry</li>
                                                <li>Spiti valley hats</li>
                                                <li>Spity vellay shawls</li>
                                                <li>Local honey</li>
                                                <li>Organic tea</li>
                                                <li>Spices</li>
                                            </ul>

                                            <h3> Conclusion</h3>
                                            <p className='mb-4'>
                                                In this blog, you will get to know about all the things which you can do, what places to explore, what the best months and what the best places you can shop in, and many more. By reading this blog, I think you get the normal idea of the whole Spiti Valley tour, and if you want to do all the things even at cheap prices, then you can contact wagnistrip as we provide the cheapest price for your travel services.
                                            </p>
                                            <FAQSection faqData={faqData2} />
                                        </div>
                                        ) : formattedTitle === 'Cheap Places to Travel in the World' ?
                                            (
                                                <div className='news_details_content_area'>
                                                    <img
                                                        style={{ borderRadius: '6px' }}
                                                        src={getImageUrl("cheapplacestop.png")}
                                                        alt="img"

                                                    />
                                                    <h2 style={{ fontSize: isMobile ? '22px' : '',lineHeight: isMobile ? '34px' : '' }}>{formattedTitle}</h2>
                                                    <p>
                                                        Traveling must be a great adventure for some people living in the world,
                                                        and they feel a great energy in themselves when they travel to new cities.
                                                        And for all the people who love travelling,
                                                        we have come up with a list of the <strong className='text-black'> cheapest places to travel in the world.</strong>
                                                        No matter which place you are travelling to with family or solo, we always have
                                                        a mindset of saving money from every trip so that we can use the remaining amount
                                                        for our future trips, and let me remind you, there are numerous places that you can
                                                        visit on a budget.

                                                    </p>

                                                    <h3>The list is given below for your reference of the cheapest places to travel in the world</h3>
                                                    <p>
                                                        <strong className='text-black'>Vietnam : { }</strong> The budget for the trip will cost you around 1000 to 2,300 dollars per person,
                                                        and I think it's a pretty decent amount for any traveller traveling in Vietnam.
                                                        It is a very lush green forest area, which is full of mesmerizing places and street food.
                                                        The whole country is comparably affordable, and you will love to see the country's new culture,
                                                        also at a budget price. You can save a pretty amount by tasting the local street food, which is
                                                        not that costly, and will help you to balance
                                                        your money for the whole trip. You can also opt for local transportation,
                                                        which is quite inexpensive for cabs.
                                                    </p>
                                                    <p>
                                                        Top Places to Visit in Vietnam: Hanoi, Sapa, Hoi An, Ha Long Bay, Ninh Binh, Ho Chi Minh City, that's the reason behind Vietnam being considered a <strong className='text-black'>dream destination places</strong> for so many people.

                                                    </p>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces1.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces2.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>

                                                    <p>
                                                        <strong className='text-black'>Philippines : { }</strong> It also comes in the list of <strong className='text-black'>the cheapest places to travel
                                                            in the world.</strong> The average cost of a person travelling to the Philippines will be 100 to 200 dollars for a week.
                                                        The Philippines is the dreamiest destination for all beach lovers and tropical hikers.
                                                        If we talk about travelling cheapest, then it will be travelling as trying the local food of
                                                        the country, which is slightly cheaper and also gives you the taste of the specific country's spices,
                                                        and for stays, there are multiple available options for
                                                        you where you can spend your week very easily. you can visit the most loved locations like Palawan,sigaro, and cebu.
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces3.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces4.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>

                                                    <p>
                                                        <strong className='text-black'>Georgia : { }</strong> The country is famous for its beauty and nature. They
                                                        have various spots from which you will see the real beauty of nature. The cost of travelling
                                                        there is not that expensive. You can save plenty of money with travel hacks. The country is famous
                                                        in the world for its wine production, and if you ever visit there and you love wine, then you should try
                                                        the country's wine. They have a very unique cuisine that you have to try, which will enhance your taste buds.
                                                        There are so many beautiful cities that you can visit, such as Kutaisi, Batum,
                                                        and Tbilisi. At approximately, you will be spending 30 to 50 USD per day.
                                                    </p>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces5.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces6.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>

                                                    <p>
                                                        <strong className='text-black'>Bolivia : { }</strong> The country is famous for
                                                        so many things including the world's largest salt flat, and that makes it one of the dream destination places for numerous people living in the world.
                                                        The place has ancient monuments and structures that are worth visiting.
                                                        In terms of the cost of living, a week is like 150 to 200 USD. You can also travel by public transport to add new experiences to your life.
                                                        Last but not least is Romania, and the country has a combo of a tourist package which includes the top-tier tourist places with a unique blend of their
                                                        cultural food. The amount will be 35 dollars per day, hardly. It is a budget-friendly option for all the tourists who have a tight budget this time for travelling, and they are looking for cheap travel destinations.
                                                    </p>

                                                    <div className="row mb-5">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces7.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("cheapplaces8.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>
                                                    <FAQSection faqData={faqData} />

                                                </div>
                                            ) : formattedTitle === 'Top 5 Places to Visit in Dubai for Free' ? (
                                                <div className='news_details_content_area'>
                                                    <img
                                                        style={{ borderRadius: '6px' }}
                                                        src={getImageUrl("topdubai.jpg")}
                                                        alt="img"

                                                    />
                                                    <h2 style={{ fontSize: isMobile ? '22px' : '33px',lineHeight: isMobile ? '34px' : '' }}>{formattedTitle}</h2>
                                                    <p>
                                                        We always think that an international trip will cost us thousands of rupees, like flight tickets, accommodation, food, and many more things, but what if we say you don't have to spend a single penny of your savings, and you can travel to Dubai for free?. You just have to book a trip to Dubai with wagnistrip, and we are going to tell you about the top places to visit in Dubai for free. No matter whether you are going with family or alone, you can still visit the places without any doubt, which include historic places, cultural activity places, and you will also get to know about the cheap things to buy in Dubai.

                                                    </p>
                                                    <p>
                                                        As you will be wondering also how you can visit any free locations in Dubai, as it is very popular among all the people in the world for its luxury a nd expensive expenses, and if you are a budget traveler, then it would be a great success blog for you. You will see in the further sections of the blog all the information you need about this place.

                                                    </p>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("dubai1.jpg")}

                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("dubai2.jpg")}
                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ul style={{ listStyleType: 'order' }} className='ms-4'>
                                                        <li><p>
                                                            <span className='fw-bold text-black'>Dubai Fountain Show :</span> The beautiful fountain show happens right beside the famous Dubai Mall and next to the world-famous building known as burj khalifa. You don't have to pay a single amount of money to see the show and enjoy your time watching the beautiful show. You can also listen to the music coming from the fountain, but the fountain show is also for a few minutes, but it's not like you won't see it again. This show happens between 6 pm to 11 pm, and it gets repeated every half an hour within this timeline. The best view of the fountain can be seen from the bridge nearby, and this place comes in the first list of Places to Visit in Dubai for free. We can guarantee that you will love this place, as it is inherently beautiful and peaceful to watch. This will be the perfect spot for you to take memorable photos during your Dubai Tour Itinerary.

                                                        </p>
                                                        </li>
                                                        <li><p>
                                                            <span className='fw-bold text-black'>Al Seef Heritage Area :</span> This place is for all the lovers who love historic places and want to get to know about the history of that particular country or the world. The place is a combo of modernity and history, you will get to see the mesmerising Arabian building, wooden rustic boats, and historic, beautiful streets. This will lead you to the old Dubai and how that looked in the past, and if you get to see the past of any place, and how the people living in the past and what changes that happened, and all the things are for free, it is like a miracle where in any other country you will be paying a good amount of money to see any type of historic places specifically for the tourist ut in dubai its all free and thats the reason you should visit dubai more and plan your next dubai tour itinerary by adding this place and also suggesting to your friends.
                                                        </p>
                                                        </li>
                                                        <li>
                                                            The next location in the list is Jumeirah Beach, which is also a famous location attracting people for its beauty and cleanliness. This beach is clean and well-maintained. There is a separate fun play area is also built up for the kids and a jogging track with swimming on the beautiful beach. From the beach itself, you can get beautiful photos of being outside at burj khalifa, as from the background of the beach, you can see what makes this place more famous. You must see the place in the list of places to visit in Dubai for free.

                                                        </li>
                                                        <li>
                                                            <span className='fw-bold text-black'>Dubai Creek</span> is also the next place for you to explore in Dubai when you don't have money, or you want to explore the places that can be explored for free. The place plays a significant role in the history of Dubai and is still a major part of Dubai still do. The place is a major hub for all the waterways in the past, and you can explore the area where the old building and boats will tell you alot of stories. There is a lively market that you can see near the waterways, where you can interact with the locals and get to know about the history. This place is also comes in one of the places to visit in Dubai for free.

                                                        </li>
                                                        <li>
                                                            <span className='text-black fw-bold'>Ras Al Khor Wildlife Sanctuary</span> is a famous sanctuary where you can see a wide variety of species that migrated from different places to be saved and can live freely without any trouble. The entry to the sanctuary is just like the blog is for places to visit in Dubai for free; you don't have to pay a single amount of money to enter this place. The location is famous among tourists and other places for its pink flamingos, and there is a place which is specially designed for all the people where they can do bird watching. This will be the best from November to March; therefore, if it is possible, try to visit Dubai in this period. The area is slightly wet to maintain the climate conditions for the birds living there.

                                                        </li>
                                                    </ul>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("dubai3.jpg")}

                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("dubai4.jpg")}
                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4 className='mt-3'>Cheap Things to Buy in Dubai</h4>
                                                    <p>
                                                        As you have already gotten to know about the places to visit in Dubai for free but let us give you some information about the cheap places to buy in Dubai.
                                                    </p>
                                                    <p>
                                                        The best thing you can find in Dubai is none other than dates. There are specific markets where you can get multiple types of dates, which are kinda cheap, and you can take them back to your home.

                                                    </p>
                                                    <p>
                                                        The second thing is the spices, which you will love and can obtain at a reasonable price and of high quality.

                                                    </p>
                                                    <p>
                                                        The third thing is the perfume oils, which are available at cheap prices without alcohol, of good quality.
                                                    </p>
                                                    <p>
                                                        The other things which you can buy from Dubai at cheap prices are coffee sets, key chains, magnets, and pashmina scarves

                                                    </p>
                                                    <p>
                                                        The things mentioned above you can buy easily without paying a huge amount of money.

                                                    </p>
                                                    <p>
                                                        If you don't have enough time to spend in Dubai, then you can also go for a Dubai half-day city tour, and there are multiple places which you can visit in the meantime, which are burj khalifa. Dubai Marina, and many more places. You can explore the above places. The Dubai half-day city tour is the best option for you to explore and see various locations in less time.

                                                    </p>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("dubai5.jpg")}

                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="news_details_left_img">
                                                                <img
                                                                    src={getImageUrl("topcountries2.png")}
                                                                    alt="img"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h4 className='mt-3'>Conclusion</h4>
                                                    <p>
                                                        Dubai is also known as one of the most expensive countries to visit worldwide, but there are many places to visit in Dubai that are free, allowing you to explore them without paying a single amount, as mentioned in the above sections. If you are visiting Dubai in the upcoming months, then you can contact Wagnistrip as we promise to provide the cheapest deal that you won't find anywhere, and you will have the best experience of your life.
                                                    </p>

                                                    <FAQSection faqData={faqData4} />

                                                </div>
                                            ) : formattedTitle === 'Goa Tourism Guide for Your Upcoming Trip of 2025' ? (

                                                <div className='news_details_content_area'>
                                                    <img
                                                        style={{ borderRadius: '6px' }}
                                                        src={getImageUrl("goatop.png")}
                                                        alt="img"

                                                    />
                                                    <h2 style={{ fontSize: isMobile ? '22px' : '',lineHeight: isMobile ? '34px' : '' }}>{formattedTitle}</h2>
                                                    <p>
                                                        Currently planning for a Goa trip with a friend or family?, Looking for a <strong className='text-black'>Goa tourism guide</strong> that will give you information about Goa in a single blog, will tell you all about the couple-friendly places, what are the places where you can travel in South Goa, also tell you  about the  <strong className='text-black'>best lunch places in Goa.</strong> The place is a perfect Blend of a beachy place with a tropical region where you will be welcomed with pleasant weather and mouth-watering seafood meals.


                                                    </p>

                                                    <h3>Best Places to Stay in Goa with Family</h3>
                                                    <p className='mb-2'>
                                                        There are various places that you can explore in the entire Goa, but there are some places that we have researched and come up for you to take your experience to the next level as your  <strong className='text-black'>Goa tourism guide.</strong>
                                                    </p>
                                                    <Stack component="ol" spacing={2}>
                                                        <li>Skin Morjim Beach Resort is considered to be one of the most loved destinations for family-friendly places.it is a 3-star resort which is also family friendly and provides all the facilities which a person needs during their vacation with their family.</li>
                                                        <li>The second place in the list is Simrose, which is also a 3-star resort situated near the south of the Agonda beach and a perfect place for family-oriented travelers.</li>
                                                        <li>The next place is Casa de Silver, which is near the Calangute and Baga beaches. The place has a very beautiful view, which will give you the perfect blend of the beach and tropical aura.</li>
                                                    </Stack>
                                                    <p>
                                                        You can visit the given places for your next trip with your family for a better experience.
                                                    </p>
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa1.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa2.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>
                                                    <h3>Hidden Places in Goa to Explore</h3>
                                                    <p className='mb-3'>
                                                        There are various places that you can easily explore in Goa, and they are also very popular among tourists, which makes the place slightly crowded, and you will not be spending that much time there. And to resolve that issue for you, we have come the <strong className='text-black'>top hidden places to explore in Goa</strong> for you:

                                                    </p>

                                                    <Stack component="ol" spacing={2}>
                                                        <li> <strong className='text-black'> Arvalem caves & waterfall { }:</strong> The place is a hidden gem, and you will love to see the natural beauty there. It is said that it was discovered by the Buddhists or the Pandavas in the past. After the rainy season, the waterfall builds up a lake, which makes the place best for swimming and a picnic spot. If you are going to Goa, then going to this hidden spot is a must.</li>
                                                        <li><strong>Butterfly Beach { }:</strong> The beach is located south side of Palolem, which makes the location very less crowded as compared to other popular beaches in Goa. The beach has the shape of a butterfly, that's the reason behind its name, as a butterfly. You will see a lot of crabs and starfish near the beach at the time of low tide</li>
                                                        <li><strong>Kakolem Beach { }:</strong> The beach is also known as the tiger beach, and it is the perfect place for people who love watching the scenery by just roaming or sitting there. The place provides another level of peace, and you can spend time with your loved ones there.
                                                            To transform your usual Goa trip into a different one, you can try visiting the above-mentioned places on your next trip.
                                                        </li>
                                                    </Stack>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa3.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa4.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>
                                                    <h3>Best Places in Goa for Couples</h3>

                                                    <p>
                                                        There are various places in Goa that you can visit, in the north and south of Goa. We will be mentioning some of the places for couples that you can visit in goa.
                                                    </p>

                                                    <h4 className='my-4'>Places to Visit in South Goa for Couples</h4>
                                                    <Stack component="ol" spacing={2}>
                                                        <li> <strong className='text-black'> Palolem Beach { }:</strong> The beach is located in the south region of Goa, where the beach is surrounded by palm trees, and the beach is well known for its ethnic beauty and white sand, which makes it the perfect spot for all couples to enjoy their time. Compared to other beaches, it is slightly less crowded.</li>
                                                        <li><strong>Varca Beach{ }:</strong> the beach is already known for the most beautiful sunset you will see, as compared to any other beach, which will add a new chapter to your <strong className='text-black'> Goa tourism guide.</strong> You will see multiple beach shacks there for food and drinks.</li>

                                                    </Stack>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa5.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa6.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>

                                                    <h4 className='my-4'>North Goa Places for Couples</h4>

                                                    <Stack component="ol" spacing={2}>
                                                        <li><strong>Fontainhas { }:</strong>It is a district located in Panjim, Goa. The place has beautiful narrow lanes which is coloured in different colors.The place has Portuguese houses which will tell you about the history of the place.The place also counts in the UNESCO world heritage site. It is a perfect place for couples also for a romantic walk.
                                                        </li>
                                                        <li><strong>Morjim Beach { }: </strong> This beach has so many things that will attract all the tourists, not only couples but families and kids also. You will also see so many olive ridley turtles. You can also go for the sports water activities with your loved ones.</li>
                                                    </Stack>
                                                    <p>The new couples and other couples can visit the above places for a nice trip and if your goa tourism guide will include these places then your trip will be the best memory of your life.</p>

                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa7.png")} alt="Baga Beach" className="news_details_left_img" />
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <img src={getImageUrl("goa8.png")} alt="Baga Beach Nightlife" className="news_details_left_img" />
                                                        </div>
                                                    </div>
                                                    <h3>Best lunch places in Goa </h3>
                                                    <p>We will be making a list of the best lunch places in Goa, which you can visit in your Goa trip for a mouthwatering lunchtime time which is written below for your reference:</p>
                                                    <Stack component="ol" spacing={1}>
                                                        <li>Copperleaf Panaji</li>
                                                        <li>Copperleaf Porvorim</li>
                                                        <li>Perfect cup</li>
                                                        <li>Elephant and Co., Anjuna</li>
                                                        <li>Café de Port</li>
                                                        <li>Pickled Mango</li>
                                                        <li>Treetop Tava</li>
                                                        <li>Mama Miso</li>
                                                        <li>Zodiac</li>
                                                        <li>Nireas</li>
                                                    </Stack>
                                                    <FAQSection faqData={faqData1} />

                                                </div>
                                            ) : "comming soon ......"
                                }
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="news_details_rightbar">
                                <div className="news_details_right_item">
                                    <h3>Recent news</h3>
                                    {travelNewsimg.map((blog) => (
                                        <div
                                            key={blog.id}
                                            className="recent_news_item"
                                            onClick={() => handleClick(blog.title)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="recent_news_img">
                                                <img src={blog.image} alt={blog.title} />
                                            </div>
                                            <div className="recent_news_text">
                                                <h5>{blog.title}</h5>
                                                <p>
                                                    <span>{blog.date}</span> <i className="fas fa-circle" /> {blog.readTime}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="news_details_right_item">
                                    <h3>Popular tags</h3>
                                    <div className="news_tags_area">
                                        <ul>
                                            {(currentBlog?.tags?.length > 0 ? currentBlog.tags :
                                                ['Assistant', 'Tours', 'Tour guide', 'Business', 'Goa Nightlife', 'Manager', 'Travel agency', 'Destination']
                                            ).map((tag, index) => (
                                                <li key={index}>
                                                    <Link to="#" className={index === 0 ? "active" : ""}>
                                                        {tag}
                                                    </Link>
                                                </li>
                                            ))}

                                        </ul>
                                    </div>
                                </div>
                                <div className="news_details_right_item">
                                    <h3>Share causes</h3>
                                    <div className="share_icon_area">
                                        <ul>
                                            <li>
                                                <Link to="https://www.facebook.com/tripwagnis/" target="_blank">
                                                    <i className="fab fa-facebook-f" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="https://twitter.com/wagnistrip/" target="_blank">
                                                    <i className="fab fa-twitter" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="https://www.instagram.com/wagnistrip/" target="_blank">
                                                    <i className="fab fa-instagram" />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="https://www.linkedin.com/company/88455961/" target="_blank">
                                                    <i className="fab fa-linkedin-in" />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <Footer />
        </>
    )
}


export default TourDetails

const FAQSection = ({ faqData }) => {



    return (
        <div sx={{ mt: 5, mb: 5 }} className=''>
            <Typography variant="h4" align="center" fontWeight="bold" color="var(--main-color)" gutterBottom>
                FAQ's
            </Typography>

            {faqData.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 0, py: 0, boxShadow: 'none' }}>
                    <AccordionSummary sx={{ py: 0 }} expandIcon={<GridExpandMoreIcon />} aria-controls={`faq-${index}-content`} id={`faq-${index}-header`}>
                        <Typography sx={{ py: 0 }} color='black' fontWeight="bold">Q. {faq.question}</Typography>
                    </AccordionSummary>
                    {faq.answer && (
                        <AccordionDetails sx={{ py: 0 }}>
                            <Typography>{faq.answer}</Typography>
                        </AccordionDetails>
                    )}
                </Accordion>
            ))}
        </div>
    );
};