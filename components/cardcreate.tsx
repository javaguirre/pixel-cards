
import { useState } from 'react'

function CardCreate() {
  const [cardData, setCardData] = useState({
    name: '',
    price: ''
  })

  const handleInputChange = (event) => {
      setCardData({
          ...cardData,
          [event.target.name]: event.target.value
      })
  }

  const sendCardData = (event) => {
    event.preventDefault();
  }

  return (
    <form onSubmit={sendCardData}>
        Name: <input type="text" name="name" onChange={handleInputChange} />
        Price: <input type="text" name="price" onChange={handleInputChange} />

        <input type="submit" value="Save" />
    </form>
  )
}

export default CardCreate

