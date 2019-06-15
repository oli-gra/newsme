import React from 'react'
import InputUrl from './InputUrl'
import InputFile from './InputFile'

const AddNews = ({ handleUrl, handleFile }) =>

   <div className='addnews'>
      <div className='addurl'>
         <InputUrl out={handleUrl} />
      </div>
      <div className='addfile'>
         <InputFile out={handleFile}
         />
      </div>
   </div>

export default AddNews;