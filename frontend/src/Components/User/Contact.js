import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

function Contact() {
    const [contactDetails, setContactDetails] = useState({
        first_name: "",
        last_name: "",
        email: "",
        message: "",
    })
    const onChange = (e) => {
        setContactDetails({
            ...contactDetails,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            contactDetails.first_name === "" ||
            contactDetails.last_name === "" ||
            contactDetails.email === "" ||
            contactDetails.message === ""
        ) {
            alert("Please fill out all fields", "error")
        } else {
            sendEmail()
        }
    };
    const sendEmail = () => {

        // emailjs
        //     .sendForm(serviceID, templateID, form.current, {
        //         publicKey: publicKey,
        //     })
        //     .then(
        //         () => {
        console.log('SUCCESS!');
        alert("Thank you for your message! I will get back to you soon.", "success")
        // },
        // (error) => {
        // console.log('FAILED...', error);
        alert("Oops! Something went wrong. Please try again later.", "error")
        // },
        // );
    };

    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },[])
    return (
        <div><>

            
            <div className=" px-6 py-24 sm:py-10 lg:px-8 border-t-2 bg-gray-200 border-black box-border "
                style={{ "borderTopLeftRadius": "10rem", "borderTopRightRadius": "10rem" }}>

                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                    We'd love to hear from you! Whether you have questions about our products, need assistance with an order, or want to provide feedback, our team is here to help.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl sm:mt-10">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                First name
                            </label>
                            <div className="mt-2.5">
                                <input
                                    value={contactDetails.first_name}
                                    onChange={onChange}
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2.5">
                                <input
                                    value={contactDetails.last_name}
                                    onChange={onChange}
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    autoComplete="family-name"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                                Email
                            </label>
                            <div className="mt-2.5">
                                <input
                                    value={contactDetails.email}
                                    type="email"
                                    onChange={onChange}
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                                Message
                            </label>
                            <div className="mt-2.5">
                                <textarea
                                    value={contactDetails.message}
                                    name="message"
                                    onChange={onChange}
                                    id="message"
                                    rows={4}
                                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="mt-10">
                        <motion.button
                            whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.1 }}
                            type="submit"
                            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Let's talk
                        </motion.button>
                    </div>
                </form>
            </div>
        </></div>
    )
}

export default Contact