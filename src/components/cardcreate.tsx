import { useState } from 'react'

import EthersClient from '../services/ethersclient'

type Props = {
  handleCreateCard: React.FormEvent
}

function CardCreate({ handleCreateCard }) {
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

  const handleSubmit = (event) => {
    event.preventDefault()
    handleCreateCard(cardData)
  }

  return (
    <form onSubmit={handleSubmit}>
        Name: <input type="text" name="name" onChange={handleInputChange} />
        Price: <input type="text" name="price" onChange={handleInputChange} />

        <input type="submit" value="Save" />
    </form>
  )
}

export default CardCreate

