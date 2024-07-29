import React from 'react';
import './index.css'
const Error404 = () => {
  return (
    <>
        <div className="text-center">
            <img id="img-error" src="https://img.freepik.com/premium-vector/character-illustration-stone-with-404-error_309278-8351.jpg?w=740"></img>
            <div className="headi">
                <span className="error-404">404</span>
                <p style={{fontSize:"0.9rem"}}>Page not found 😥</p>
            </div>
        </div>
        
    </>
);
};

export default Error404;