import React from 'react'
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaPeopleLine } from "react-icons/fa6";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { MdLuggage } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { Link } from 'react-router-dom';

import Offer from '../Offer';

import Footer from '../Footer';
import { getImageUrl } from '../../utils/airlineUtils';

const AgentData = () => {

    return (

        <>
           
            <header className='main_header_arae'>
                <div className="main-navbar">
                    <div className=" container d-flex align-items-center justify-content-between">
                        <div className="main-responsive-menu">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="logo">
                                        <Link to="/" >
                                            <img style={{ width: '250px' }} src={getImageUrl("logo.png")} alt="logo" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="option-item">
                            <Link to="/login/agent-login" className="btn  btn_navber">
                                Login / Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <Offer title="Grow your Travel Business with Wagnistrip" />

            <div>
                <section id="how_it_work_area" className="section_padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                <div className="section_heading_center">
                                    <h2>How it works</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                <Link to="/login/agent-login">
                                    <div className="how_expert_boxed">

                                        <img
                                            src="data:image/png;base64,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"
                                            alt="icon"
                                        />
                                        <h3>Sign up</h3>
                                        <p>
                                            {" "}
                                            Welcome to Wagnistrip! Please complete all signup steps carefully. If you skip any step, you won’t be able to register again with the same email or phone number.
                                        </p>
                                    </div>

                                </Link>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                <div className="how_expert_boxed">
                                    <img
                                        src="data:image/png;base64,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"
                                        alt="icon"
                                    />
                                    <h3>Add your service</h3>
                                    <p>
                                        {" "}
                                        Add your service after completing signup. Wagnistrip offers agents access to special flight fares with exclusive discounts ranging from 5% to 10% on selected bookings. Don’t miss out!
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6 col-sm-12 col-12">
                                <div className="how_expert_boxed">
                                    <img
                                        src="data:image/png;base64,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"
                                        alt="icon"
                                    />
                                    <h3>Get booking</h3>
                                    <p>
                                        {" "}
                                        Get bookings easily through Wagnistrip. After signup and service approval, you can receive flight, hotel, or cab bookings directly from customers and earn commission on every successful transaction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="video_area_two">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="video_two_left_side">
                                    <h2>Benefit of become a local expert</h2>
                                    <p>
                                        Mollit aliqua proident enim consectetur ad nostrud. Id et magna
                                        irure fugiat ea sit eu cupidatat.
                                    </p>
                                    <div className="video_exp_wrapper">
                                        <div className="video_exp_item">
                                            <div className="video_exp_icon">
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAANQSURBVHgB1ZrPTxNBFMfflvJDIFBNVC4kNeKNhKI3fyTFk9x6IR5bPJugR0/gSW+WP8C0V6OJ4QS39mDiRdOa6EmS3eCFSCIVDPKj8nxvt9OU7Q+2nZnt9pO8bnYzbfe7772ZNzNrgCSIGKVDgmyGLEYWIYu6mlkVK5F9ISuyGYZhQTehm4+QLZPlUA6TLEMWBz+pEbCL6jEroqKgE/qDJU0CGpFRLggdL2SwOyyDCvipkBWwu5go4x10RJgYDDikn0C7oBNOJgaP9kKNvvAeg4s3Meh0r0En6b5vwyUiSgcTgg9XCLO1lUHI1UBNd6cfLoMytReqQtApE1LQO8TpnlPipNYjSeg9qhFk50gP5UYj5ihX8uHKSQIUsrd9ClvFY9j5XqbjiX1+ZaqPLAyTs/0wGRuAwVEDFMGRlBceKYAzl+iYr+uHsPnhCH4Uy3D05/Tc9pdJ1PhECKbnh2Dq7iBIUCKPXAxXwkpKBLPxcr+t9jubZTIg0SgrhKuQGCe7tIgAYAuJQ+8TYSEz0PvYQiLgI7cXR2xTDQuJggbGJkJ112wRqWEYvxoCxZS0eIS71uTrS2eevBDxjbrp9TZ7OA9YYdDA3vY/+E3GNy7QKILRI4THhjdLJXi4GqmK0SmCBsSismB154QQ85MGvlYixif6QJI1/uB/t0AB0w+G6q4JMa08cf3eAEiS5g9lHrm1MNywp2Ixzbi5cAFuyJUnz8UsUZlHuJrlnJiM9XtqzyLuPx4FCXgRfEWcGFRwZUHxpOrzu7/wMXMAhw2qYPba/LMxz4KbYIEzD7HEBRbCC1+vQDHc/W682Key/qR6jb1wJzUiOxexwCXChoQkUCOf3h5g9tEv3CocowJ4va3hAM4eiULwp7m8/MOJnW7WQMwQd8Hn4rEN8mSL5+1uif5yDYKHBU4uzHnZohNC8hAcOIye0s1f49URr18SocVhxXnSzfBiAatkaRJQgk7B7q3A897HSrPeqBMhcfSftDIBLjE59Icc6ty9Rf1eMcmUrmq2EpNDPegJoxZCeBNU5X46/5Y/XmggRlWImaj7TQYPYlIoRw79DKVWoFMZdxJmaQga6OSM18Eyh36/6dMu6ORNFutfJODzdOAFNAO7ncQu/gNBp8cM1vliTwAAAABJRU5ErkJggg=="
                                                    alt="icon"
                                                />
                                            </div>
                                            <div className="video_exp_text">
                                                <h3>Lowest price guaranteed</h3>
                                                <p>
                                                    Mollit aliqua proident enim consectetur ad nostrud. Id et
                                                    magna irure fugiat ea sit eu cupidatat.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="video_exp_item">
                                            <div className="video_exp_icon">
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOLSURBVHgB1ZpPTNNQHMd/nUNQiCwmKgdNZjJuJox4Ixi3m/E0Dp4ZMfEkQc8ewIPx4mEa7yOeNJoAJ7yNROSmYMINktY/ByIxLFPImMrP369vhbJ1W2vfW7tP8uvW9rV9377f771fX6uBTxAxTj8ZsiGyJFmMLF5TzKhakewT2RqbpmkGBAlVPkY2TVZAf+hkebIUtBObgB2Uj14VFQeV0AWmFAlwIi9dEIpWyGMwTIMM+K6QrWKw6OindVCI0DEcsEvfA6+gcCcdw4c3V6MD5jC8uBODonsNO+O19dZqRMTpR4fwwxnCsD0ziNQUkNPdqYfToLx9w6EQFGlCFjqHFNU5a63YW2QcOo9DDzJjpINiw4k0xcqS1SIZ6FxMT4rYV2Swkt+FJ9e3obT113H/+mLZ3P917TdIwmyEaNWtkuCT/V8IG8v78H1TCNhYrkB3n1ZX7ltVwMa7fTrmABKj3eATzkKSGi1Y0Rz45MXtHRLxB7wykj0NIxO94JOJKC1SIAEWcSnZ5alSi49LslwsxkKGQBLsSv0DJyAATCExkMQmxcXm8g9Px8gSzkLiIIlziSgMjp50Xf7jmzJIoii1RS6QEC8xsv5WmhAjCgqYf1Ci4D8K4vTdPhi81m120S+nijD2qB/ODESo9XqOlfOBEQEF8PhQ2jqyCglgyrR9m3o3FsO9XHqyF67eOgU+MShFWVMipBU86vO48+H1nowBcYEXLMSAgCg83zVTGp/keKEkRtKTfWY8WJxPNL7MyuyeWZY7CaeUpgUPradEvgL/iYNEmlXcCe69Lg53UfB7cjOeBJ+xVviKn0ESHMyNUo5G4hI07mSoF/OIQTZm38Bn5yl+32k851liZK847r/z6uyxspZgLs+u5cGtDBAPU4Z9o7TslyvDleNWccJyG071r9zogQUaa/g/4yEDniebIBHFuj0opkbbzpfVCj67uY3v87tY/nnQqnjLKVPrmX0HJKYqklkC0QpGs0LWgLgA4cMAEQtpN6/oLCFLEB7Y/+9T5S/z7IjbgyzXYrfi6aAg3YsFPCXLOQazWzC4GXgO5JnqzfQPnSiF7ScnTUCNmAK2hwKqfHuL6ltFRzEAqwfVtYoaN2oihEd6me/T+VzBzC2jPBfTUfWXDC7EZNEfBWynKzWDKpLB/3OzHIQNFDHjdrAsYLu/9PEKiriZxfoPCXg9F3oBjcCgg7iGf6WG6f9DEM2tAAAAAElFTkSuQmCC"
                                                    alt="icon"
                                                />
                                            </div>
                                            <div className="video_exp_text">
                                                <h3>Easy and quick booking</h3>
                                                <p>
                                                    Exercitation adipisicing aliquip laboris reprehenderit
                                                    cupidatat labore excepteur.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="video_exp_item">
                                            <div className="video_exp_icon">
                                                <img
                                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAP1SURBVHgB1ZpNTBNBFMdf/QKlatX4cTGpCZ408QMvfiXgSW+YSPQkEKMnDXrTE3jSY0k8mZDiDaIJcoJbOSA3pCZ4wqQrXIgmUhE/QOX5/rMdXJYCbWe2XX7Ja7uvs9v573tvZna3ETKEmePy1ih2QuykWEws7mvm5Cwr9k4sDYtEIg5VEul8TKxdLMVmZMSSYvVUTjwCZtg+mZyoOAWJ/EBbQALykbQuiN0oJLkytJMNcFbExriyZNgkOuyKyHA4QErfp2JhN50yHD6KSzXZoY/DS2Fi2B1ew06zv98Rn4i4vGUo/GCFcMq7Mtjka2BnuAseLIOSXseSEHaXCS20caiXPrfoDW9EmmnjsZRBqkY2UG3ko0FqZUhHpJE2LiqTdETGyL2WsMJU+je9H/hFk+kFmp1eVL79tVvooFjtxW1Ue6GKLJKViOyJ2EwrdHrgyawSotl1aBPNz7Gy/77NdKMzpr6zxCkIQVr1kSGfP/yhnrav0uFF1cG6ph10/HI1VUXdqQpCJobnaST5XQmG/7qIOSBRskArhCTkQxsZgI69uDWjRJxu2k7nW2poXFIL4iaGF5QfqVV3bTsdvVhFo69+KkEQ09y110ZkHuAIJ8iQnras6iwicObaDrWdejanvoMPQNTg029KMHx10g5RQipaIAYhMTIA9TA7/Ved1bOtrgh0Ghy7Uk0N92qWpQ/aos3ppmq1D/b31lSpQEicDMDoBHCWp8ZcUXr78Mmt6vPNrj0qAhq0wX7ap49hQNY4Ip9yZ79Wcv+t5D5APTTciy5rh8jc7t2rBCJC44PzaigGk+YRcYyHDC0EncNnpNOlu9Gl0crLbhl2Lz/aucKvo2iAYzRc+FMCw+mVhztVQT+//mVFe/jy+cHoyx9UIo5MiGkjIW+6l/+4rglZK+TMz2p+opHukoX04wWp5VCJBb9aStzp3VeUH3hn/iLBPEjW1ggV4rG+SoQQh0qkOmrvPOQbHNYBN8E79AZ68pFKpF6GVExqNhZ/51primnuiF31OlAjuMVf0tUh5gS9BDEF67ACcci9mHK8Tl3sgYHhdr15ooiIviasdCORrP8LHCFNgbL2aITaON8apXVAxx+IgKv5RAB9hThDhkuVABkiNwrOWo10TPspfDjk1kJDIY/otJAhCg86jY7g7kihO+nUQlrhur2S6QUBnWKJ1eqgILhyd+Dx7KMjdzLNkQPVc/lJWBPgE5Pi8pDiIJ/ecvBRybB7+yl4OLioBJNGawjBQ1Cbz9NxrMrcW2Z7KZbhoP/JUICYFjYjxeVMpbWQjjRyaWmWoLDBbs0UOlmmuNz/9CkWduumm1f+kQDbidALWA2udBH7+AeigXIZ9zDKCwAAAABJRU5ErkJggg=="
                                                    alt="icon"
                                                />
                                            </div>
                                            <div className="video_exp_text">
                                                <h3>24/7 Customer support</h3>
                                                <p>
                                                    Fugiat dolor enim est proident ea id veniam nulla ipsum cillum
                                                    aliqua.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="video_two_right_side">
                                    <img
                                        src="https://andtour-react.netlify.app/static/media/video-two.248b871f5d76f7dfefad.png"
                                        alt="img"
                                    />
                                    <div className="video_two_play_area">
                                        <a
                                            className="video_btn video_play_area"
                                            href="#!"
                                            title="Youtube Video"
                                        >
                                            <i className="fas fa-play" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about_service_offer" className="section_padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="about_service_boxed">
                                    <img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAkCAYAAAAOwvOmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ/SURBVHgBvVhLbttGGP6GlLsJ0KpI3S4zRpPGcQJUPUGoXqDOCaqcoO4JbJ0g8QlsnyDuCcTsurMWTWsgKTrZ9pEqizZBZHLy/RQlDSk+ZSMfIHHIeX2c/02FltjWgfY72IXC17wNFNC1/Ekf2xO2jVUwKsbT6AKn5yY0aAnVdODOrWDAwd8LEbTDmEQPf30eHjedUEtq+2YQ+ApHbGpcDobkhk3IlZLSOuhe28A+m3u4WjzemGI4NuEEbUhtb1NvIjxhs4fLYVyyhomm6Jfpm4diQiNcnhBsjMPIxxabJ7ku7W9gJEaDOlIispRQ4eC2iGmF5+ehefY8HMDiR6wSe9LjnqgileqQxtXg+PxFGM5vnr0IH1PRv2HT1aXedLZnMSkxeVyBUouvUhbD/6YrJwNanriHfu7xnlh4bo0Z7t4K/sAapxRZKqxzIk1w92awx50fOY9ExFvzm+Sk0lPS+EAQUfISOo90ymFJisf1Az4wRMSZ+1m0SOCJC8AVmH9b/DITeeg8Cu5sfXtDGp5/weC6PkxbfXJh8/7Ljx/IpcOO+42ismVgVTh0H/0/xWnR0CREdTBg8wbl0rUWL/kb//Z7mBn/Eee/23C3gJGrotWdYSm+JKKT5FEBqZAK2kcF0mggc4OSIY2Csii6Xuyr8FImcOJDtAStp9eJcIbq1EbLC+98FRR6cpfUstPiX7m0JSYnxIVG1l2rArS8XXryR6ggVYgVYgoBRW3nv50vl35FRJYjZCTW0at/Sqeo0vCSD8oD1zflSU0aEyvAvVmICFxCkpaIgzRpziThRYJyfi3XN5WSUgX+qo5YbLMuhWHnYVmelKxlMxa78E0ZUjHw1LnvFSlgFTHlJQXEHJM6v+XbrBiVF69YtOfZJDtc4G2n2Ls3VH5T0y8WPqkb40WdrANkkbBfNliIUWv7Qi6OZiGC4nA30agB52ckYQt02pPMELkYVJamCiRmCbmF3tBbO93dfG6UR+zhuwypKCuphNRs3aycmaauevQSeGrlpI/KXure7UCykcGSEcIio/Dl769XZvz5dS2D50erP9vUr//+x/yMGvz5yhjODbAUXdfzsbt5Xb++9rE2k4l5KyS/2NT7JHHgzqV+DWXv/JqLWCz+hoNGTp+U4H3xMahBGvPO0NCjOxizBuzna8CFRxddYf3vZgFdMh5JTKtbWfQyzb0N2kEKh1HeDWXCDAPqAZBRPCF2dud2UFtQyImyxhNiJ2Vjkg8gsxefVBFbSaWcYlTnuo4ZPoZNvqIkATpi6InRo3P9RPIpvn2YZptJRiFSQFbcC1FWle2FRSn17pRmfPKGfspUfA+oQxWx0qRTjvPCx4H1KouKcfItig6UAXetHCxPjOv9VJsJp9+laitnSVGwBnLEkgyj3Uczy1NTxbFxXVIOsSMSeiA623qhRN9YAXHifSvprYKWBO8ypPJ4Dxd650P694DDAAAAAElFTkSuQmCC"
                                        alt="img"
                                    />
                                    <h5>
                                        <a href="/become-expert#!">Best services</a>
                                    </h5>
                                    <p>
                                        Phaseus site amet tristique ligua donec iaculis leo sus cipit.
                                        Consec tetur adipiscing elit. Incididunt ut dolore.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="about_service_boxed">
                                    <img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAkCAYAAADLsGk3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIZSURBVHgB3ZhdTgIxFIVPC/igPrCEedCEqIksoa5Ad+C4AnUFygp0B8IKdAfWFUiiGCKadAk86At/9RaBQITQ6UxlmC8hM0zaTM+0997TMhBBIIqbGzhnGqH5i9UjO8BlqyXrth2YEbFVwCPdl5E2GMLGu6zZNOXbNBNIowiDxm2ZPrRNU65/l1NaKXZyOLFpyJGOmFgMsxsfR0bIIyEY0KZlqui2Tb8iPfAWd6UdIWYe9KCSEKIobZ999VBXSrYnLyuJINfHNd2eImFybJhlJ+g8KnGF1L67uJgWMKbZlIou4cGOqGqGe5hZ8kicGFGNlgzniZjm9UNKPsAZPOMspN/FkW3bl0/5QBcJj7gKqTfVcOlYQ3FUgUechOgBnhCRPCUDeMRtRhjaUbvUl8RSXNyE6OgZyNYzueIkhHEcIiL9HAQ84hrs4k91XcKA4xgecU6/VF1vbNvu7YqQLiE8Eqcglvd3xd2ytW9mjl5iLdqVuO437BbwPPriM5QCEZDQG+OLtGd7YkjCNAbkfO8OaNA04HGtCPDP+5zEbPzoqwusiMxsrIwQhTTD7MbHycxZHbesCDXo2rlmTmbuFvBr6FyhuKvYumxuzFyB9hYjm23VySdm708KJI3n6K0lqxH6rR9Un/T0fzr0qGQqa2WC7B/QmXMp3kv1ufAMC4VQWg7oPOoK6wAVzSwsrWHRXHsh46K5lkLmFc0fxCuidvDVtwUAAAAASUVORK5CYII="
                                        alt="img"
                                    />
                                    <h5>
                                        <a href="/become-expert#!">Trusted payment</a>
                                    </h5>
                                    <p>
                                        Phaseus site amet tristique ligua donec iaculis leo sus cipit.
                                        Consec tetur adipiscing elit. Incididunt ut dolore.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="about_service_boxed">
                                    <img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALtSURBVHgBxVhBchJBFH09TVZuEq1KuXMog4VJrIKdOxpXuhJOELgBOYF4Az2B8QQhF9BeuhNLg6mCJOM2VgU2WpXATPubgEECQw/d6lvAzHT39J///n//zwCOsL0hRM4Xq3AED46gGHYuUqjAEZwZRhAew3M4AoMDbGZEjm70UR+v9LHWDGQPlnDjseiaQld0OjGMedcUuqLTmspJGsdwQae9x6Kb1F1ylGAJa8OIxsKMazuwhJVh2azw6S83YyhnK7ZWhvHBXMpWbem0o5LFUGZp2NJZqWnkIU5jpvQoO9PLZifLULpzhcTxwEF6xVCLm6OAaqQQICFChl6Kc/Toyffp3IdjEB1veFJOFCT6qP5eRm1LnTqEF/ifUNg97MhX+pCPr52dB/Lumv+JjHtMp876KkMERHux1ZGN8QU+OXrWDY7urPsHnhpqk49/g7c/+ii3T2QweXFuBPxtamnjnlJ4OaZuxvh8jCThPdx7rxmSl46CP70EU8M0dGnpr0A/lXX901ARXreOZW3RPONk3toQNVxRu1RiaOoo68pfOlKazOcwxPfz4MP6bf+CdniKpCBtCgd41jqRTdMlKSQApXQhcQ2b0KYkMN5nFGtdmENrU7nVNvfSJIw9drmCkulT6AD/GaIejAp4ll6GKWZyJD/S1FBzKtWwaMdirE1RiMYtelvafCAKJNZCjROGDKbfhRk5utdiGNKoPdGkG5bU/MwNDtsyDQMYNYohh4gb19TRhnnqv3bJqIOYqb6mFa4Mi7y574oBU1R8R4Kpm0IysKL7MGjdmr2hgCvDCDfbZNImKr75WYJJAb5HXs5rw6fHGDOrIAtj7NF9USKP7U8ZZaxNs5qBaOD5X0/ffYtbt9BjUzRqbconEUzyaN2LUMaE9xiPqovWmVA5pFEHuKZuGcH8fCwbRG2RaBw2gvRfgA30V8LtjOjS94kKHEFTu5UR6mH6yb24ebEeixj8wZWX9uAImlryXpqlomLcvF9QahUZaBon2QAAAABJRU5ErkJggg=="
                                        alt="img"
                                    />
                                    <h5>
                                        <a href="/become-expert#!">Top facility</a>
                                    </h5>
                                    <p>
                                        Phaseus site amet tristique ligua donec iaculis leo sus cipit.
                                        Consec tetur adipiscing elit. Incididunt ut dolore.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12 col-12">
                                <div className="about_service_boxed">
                                    <img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIVSURBVHgB7ZhNSsNAGIbfSXXlJiK4HhdC0U1vYHoDvYHewJ7A9gTiCVpvUE/QLN0ZQaVQwTlAF9kIok3jNzEt6STkZ5L+CH0gNP0yyTyZv8wMQwnqdYvXPHQZ0JD/faDv/aAzFLaAJgyahDIDOuXKJUFSTV0pLaEUmdJShYVyyJSSShQ6ObYadOE2KVOKm9RWTORHqAGfwZl+o5UkGxOSJbDj4algpjq4lEfzbWQ70aChpjImuF2BjMQMa2ExfzXA2F8XXhFcDRjYMLZCWSxTyGE+OijIgpDs8sgY8F5HNpPHFLhPSeZ80qD48m63KeFdSjqzzoM840KREbgsgYwQtsu5ZfoGzlLSmrVdDKJSTJHhyKYX/loJ6Rdk9naDZ+YZRuafGVZQJg1dmQUpg2RuNkBGwqn6urINnaMcVcjMaJTt9lXKBEghB3pULkP0Da+GKyTMWdYgIxt1R6fb55ERdNjh+WX2IyPdfhbJKZWrZGg+1aOJlyx5nB5bPnLKyD/zRj0c2oKqr0mnbsrNdsXVBHXeHZvC0ht9IKWUaD7cpo/meRUyhKDv4lE0sIOCkEwbS2Q7QcviXwgJrAjqIM9qLCZEg0YL6V2/Eqh7u7R6vU6IxwlWr3LBmLxG4yiQqZ/0cj4EPbulrlrDe4qxls2GCqRWtx2TQ6rUhlUNmozHwj045A+Gj316K07HF7WNR2+CizJber9tay9+YV5euAAAAABJRU5ErkJggg=="
                                        alt="img"
                                    />
                                    <h5>
                                        <a href="/become-expert#!">Awesome deals</a>
                                    </h5>
                                    <p>
                                        Phaseus site amet tristique ligua donec iaculis leo sus cipit.
                                        Consec tetur adipiscing elit. Incididunt ut dolore.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="vendor_form_area" className="section_padding_bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="vendor_form_heading">
                                    <h2>Become a vendor</h2>
                                    <p>
                                        Eu sint minim tempor anim aliqua officia voluptate incididunt
                                        deserunt.
                                        <br /> Velitgo quis Lorem culpa qui pariatur occaecat.
                                    </p>
                                </div>
                            </div>
                            <div className="container-fluid p-5 bg-light section-4" style={{ backgroundColor: '#f7f9fc' }}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-8 mb-4">
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <h2 className="">
                                                        What Makes Us The
                                                    </h2>
                                                    <h3 className="mb-4 mt-2">
                                                        Best Choice?
                                                    </h3>
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <FaHandHoldingUsd size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 ><Link to="#">Best commission structure</Link></h3>
                                                                <p>on all transactions and bookings</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <FaPeopleLine size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 ><Link to="#">Best customer support</Link></h3>
                                                                <p>available 24/7</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <HiOutlineSpeakerphone size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 className=""><Link to="#">
                                                                    Best marketing tools
                                                                </Link></h3>
                                                                <p>to boost your sales</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <TfiHeadphoneAlt size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 ><Link to="#">Best technical support</Link></h3>
                                                                <p>for seamless experience</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-4">
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <MdLuggage size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 ><Link to="#">Best travel packages</Link></h3>

                                                                <p>for all your needs</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-3 d-flex align-items-start">
                                                            <div className="icon-container me-3" >
                                                                <IoIosPeople size={40} />
                                                            </div>
                                                            <div>
                                                                <h3 ><Link to="#">Best community support</Link></h3>
                                                                <p>from experienced travelers</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="vendor_img">
                                                <img src="https://andtour-react.netlify.app/static/media/vendor.6bebcf0d1fea70e08715.png" alt="img" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </>

    )
}

export default AgentData