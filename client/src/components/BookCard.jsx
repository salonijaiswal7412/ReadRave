import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/customSelect.module.css';

function BookCard({ entry, onStatusChange, onRemove }) {
    const [info, setInfo] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Define status options
    const statusOptions = [
        { value: "wantToRead", label: "Want to Read", icon: "📚" },
        { value: "currentlyReading", label: "Currently Reading", icon: "📖" },
        { value: "finishedReading", label: "Finished Reading", icon: "✅" }
    ];

    const handleSelectChange = (selectedOption) => {
        onStatusChange(entry.googleBookId, selectedOption.value);
        setIsOpen(false);
    };

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${entry.googleBookId}`);
                setInfo(res.data.volumeInfo);
            } catch (err) {
                console.error("Error loading book info:", err.message);
            }
        };
        fetchBook();
    }, [entry.googleBookId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && !event.target.closest(`.${styles.selectContainer}`)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    if (!info) return null;

    const currentOption = statusOptions.find(option => option.value === entry.status);

    return (
        <div className='rounded-xl shadow-[0_0_1rem] shadow-gray-400 w-60 p-4'>
            <div className=''>
                <img 
                    src={info.imageLinks?.thumbnail} 
                    alt="cover" 
                    className="rounded-r-xl shadow-[0_0_.5rem] shadow-gray-400 h-48 mx-auto mb-3" 
                />
                <h3 className="text-lg font-semibold text-[#d91c7d] text-center">{info.title}</h3>
                <p className="text-sm text-gray-600 text-center">{info.authors?.join(', ')}</p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {/* Custom Select Component */}
                <div className={styles.selectContainer}>
                    <div
                        className={`${styles.control} ${isOpen ? styles.controlOpen : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <div className={styles.optionContent}>
                            <span>{currentOption?.icon}</span>
                            <span>{currentOption?.label}</span>
                        </div>
                        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
                            ▼
                        </span>
                    </div>

                    {isOpen && (
                        <div className={styles.dropdown}>
                            {statusOptions.map(option => (
                                <div
                                    key={option.value}
                                    className={styles.option}
                                    onClick={() => handleSelectChange(option)}
                                >
                                    <span className={styles.icon}>{option.icon}</span>
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => onRemove(entry.googleBookId)}
                >
                    Remove from shelf
                </button>
            </div>
        </div>
    );
}

export default BookCard;