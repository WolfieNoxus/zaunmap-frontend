import {useState} from 'react'

interface ICommentsProps { 
    comments: {
        id: number;
        userName: string;
        comment: string;
    }[];
    
}

const Comments = () => {
  return (
    <div>Comments</div>
  )
}

export default Comments