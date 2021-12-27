import { useState } from 'react'

import EthersClient from '../services/ethersclient'


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

    const ethersClient = new EthersClient(window.ethereum)
    const signer = ethersClient.contract.connect(ethersClient.provider.getSigner())
    signer.generateCard(cardData.name, 'description', cardData.price).then(
        result => console.log(result)
    )
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

