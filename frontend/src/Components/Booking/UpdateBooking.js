import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateBooking = () => {
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        email: '',
        phone: '',
        arrivalDate: '',
        members: '',
        vehicleName: '',
        guideNumber: '',
        places: '',
        days: ''
    });

    const [validationErrors, setValidationErrors] = useState({
        nameError: '',
        emailError: '',
        phoneError: '',
        arrivalDateError: '',
        memberError: '',
        guideNumberError: '',
        daysError: '',
    });

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooking();
    }, [id]);

    const fetchBooking = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/bookings/getBooking/${id}`);
            const data = response.data;
            // Convert the date to ISO format to ensure compatibility with HTML date input
            data.arrivalDate = new Date(data.arrivalDate).toISOString().substr(0, 10);
            setBookingDetails(data);
        } catch (error) {
            console.error('Error fetching booking details:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'members' || name === 'guideNumber' || name === 'days') {
            // Check if input is a positive number or empty string (allowing backspace)
            if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
                setBookingDetails(prev => ({
                    ...prev,
                    [name]: value,
                }));
            }
        } else {
            setBookingDetails(prev => ({
                ...prev,
                [name]: name === 'arrivalDate' ? new Date(value).toISOString().substr(0, 10) : value,
            }));
        }
        
        // Clear validation error when user types in the respective field
        setValidationErrors((prevState) => ({
            ...prevState,
            [`${name}Error`]: '',
        }));
    };

    const validateName = (name) => {
        const namePattern = /^[A-Za-z]+$/;
        return namePattern.test(name);
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberPattern = /^\d{10}$/;
        return phoneNumberPattern.test(phoneNumber);
    };

    const validateDate = (date) => {
        const selectedDate = new Date(date);
        const currentDate = new Date();
        return selectedDate >= currentDate;
    };

    const validateNumber = (value) => {
        return !isNaN(value) && parseInt(value) > 0;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const {
            name,
            email,
            phone,
            arrivalDate,
            members,
            guideNumber,
            days,
        } = bookingDetails;

        // Validate name
        if (!validateName(name)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                nameError: 'Please enter a valid name (only alphabets allowed)',
            }));
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                emailError: 'Please enter a valid email address',
            }));
            return;
        }

        // Validate phone number
        if (!validatePhoneNumber(phone)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                phoneError: 'Please enter a valid 10-digit phone number',
            }));
            return;
        }

        // Validate arrival date
        if (!validateDate(arrivalDate)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                arrivalDateError: 'Please select a date starting from the current date',
            }));
            return;
        }

        // Validate members
        if (!validateNumber(members)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                memberError: 'Please enter a valid number of members (positive integer)',
            }));
            return;
        }

        // Validate guide number
        if (!validateNumber(guideNumber)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                guideNumberError: 'Please enter a valid guide number (positive integer)',
            }));
            return;
        }

        // Validate days
        if (!validateNumber(days)) {
            setValidationErrors((prevState) => ({
                ...prevState,
                daysError: 'Please enter a valid number of days (positive integer)',
            }));
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/bookings/updateBooking/${id}`, bookingDetails);
            alert('Booking updated successfully!');
            navigate('/booking');
        } catch (error) {
            console.error('Error updating booking:', error.response.data.message);
            // Display the error message to the user or handle it accordingly
        }
    };

    const { name, email, phone, arrivalDate, members, vehicleName, guideNumber, places, days } = bookingDetails;
    const { nameError, emailError, phoneError, arrivalDateError, memberError, guideNumberError, daysError } = validationErrors;

    return (
        <div className="my-4 p-5 m-5">
            <div className="card p-4">
                <h1 className="text-center">Update Booking</h1>
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control w-100" id="name" name="name" value={name} onChange={handleInputChange} />
                        {nameError && <div className="text-danger">{nameError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control w-100" id="email" name="email" value={email} onChange={handleInputChange} />
                        {emailError && <div className="text-danger">{emailError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text" className="form-control w-100" id="phone" name="phone" value={phone} onChange={handleInputChange} />
                        {phoneError && <div className="text-danger">{phoneError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="arrivalDate" className="form-label">Arrival Date</label>
                        <input type="date" className="form-control w-100" id="arrivalDate" name="arrivalDate" value={arrivalDate} onChange={handleInputChange} min={new Date().toISOString().substr(0, 10)} />
                        {arrivalDateError && <div className="text-danger">{arrivalDateError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="members" className="form-label">Members</label>
                        <input type="number" className="form-control w-100" id="members" name="members" value={members} onChange={handleInputChange} />
                        {memberError && <div className="text-danger">{memberError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="vehicleName" className="form-label">Vehicle Name</label>
                        <input type="text" className="form-control w-100" id="vehicleName" name="vehicleName" value={vehicleName} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="guideNumber" className="form-label">Guide Number</label>
                        <input type="text" className="form-control w-100" id="guideNumber" name="guideNumber" value={guideNumber} onChange={handleInputChange} />
                        {guideNumberError && <div className="text-danger">{guideNumberError}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="places" className="form-label">Places</label>
                        <input type="text" className="form-control w-100" id="places" name="places" value={places} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="days" className="form-label">Days</label>
                        <input type="number" className="form-control w-100" id="days" name="days" value={days} onChange={handleInputChange} />
                        {daysError && <div className="text-danger">{daysError}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary">Update Booking</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateBooking;
