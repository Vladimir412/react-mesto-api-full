/* eslint-disable react-hooks/exhaustive-deps */
import Header from './Header'
import { Redirect, Route, Switch, useHistory, Link } from 'react-router-dom';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import React, { useEffect } from 'react';
import ImagePopup from './ImagePopup';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import EditProfilePopup  from './EditProfilePopup';
import EditAvatarPopup  from './EditAvatarPopup';
import AddPlacePopup  from './AddPlacePopup';
import Login from './Login';
import Register from './Register';
import * as apiAuth from '../utils/apiAuth';
import { ProtectedRoute } from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import disaster from '../images/disaster.png';
import success from '../images/success.png';
import Api from '../utils/Api'


function App() {

  const api = new Api ({
    baseUrl: 'https://api.mesto-vladimir.nomoredomains.rocks',
    authorization: `Bearer ${localStorage.getItem('jwt')}`
})

  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const handleIsLoggedIn = () => {
    setIsLoggedIn(true)
  }

  function handleLogin(email, password) {
    apiAuth.login(email, password)
    .then((res) => {
        if (res) {
            localStorage.setItem('jwt', res.token);
            handleIsLoggedIn(true)
            history.push('/main')
        }
    })
    .catch(err => console.log(err))
  }


  const history = useHistory()

  const [dataUserForHomePage, setDataUserForHomePage] = React.useState({user: {id:'', email:''}})


  const tokenCheck = () => {
    if (localStorage.getItem('jwt')) {
      const token = localStorage.getItem('jwt')
      apiAuth.getDataUser(token)
      .then(res => {
        if (res) {
          handleIsLoggedIn(true)
          setDataUserForHomePage({
            id: res.user._id,
            email: res.user.email
          })
          history.push('/main');
        }
      })
      .catch(err => console.log(err))
    }
  }

  React.useEffect(() => {
    tokenCheck()
  }, [isLoggedIn])

  const [currentUser, setCurrentUser] = React.useState({user:{name: "", about: ""}})

  React.useEffect(() => {
    if (localStorage.getItem('jwt')) {
    api.getInfoAboutUser()
    .then((res) => {
      setCurrentUser(res)
    })
    .catch(err => console.log(err))
  }}, [isLoggedIn])

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false)
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false)
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false)
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  const [isSuccessInfoRegister, setIsSuccessInfoRegister] = React.useState(false)
  function handleSuccessInfoRegister() {
    setIsSuccessInfoRegister(true)
  }

  const [isDisasterInfoRegister, setIsDisasterInfoRegister] = React.useState(false)
  function handleDisasterInfoRegister() {
    setIsDisasterInfoRegister(true)
  }

  function handleRegister(email, password) {
        apiAuth.register(email, password)
        .then(res => {
            if (res) {
              handleSuccessInfoRegister(true);
                history.push('/login');
            } 
        })
        .catch(err => {
          handleDisasterInfoRegister(true)
          console.log(err)
        })
  }

  const [selectedCard, setSelectedCard] = React.useState(null)
  function handleCardClick (card) {
    setSelectedCard(card)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setSelectedCard(null)
    setIsSuccessInfoRegister(false)
    setIsDisasterInfoRegister(false)
  }

  useEffect(() => {
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups()
      }
    }
    document.addEventListener('keydown', closeOnEscape);
      
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
    }
      
    
  }, [])

  const [cards, setCards] = React.useState([])


  React.useEffect(() => {
    if (localStorage.getItem('jwt')) {
    api.getInitialCards()
    .then((data) => {
      const arrCards = data.cards.map((card) => {
        return {
          key: card._id,
          id: card._id,
          name: card.name,
          link: card.link,
          length: card.likes.length,
          owner: card.owner,
          likes: card.likes
        }
      })
      setCards(arrCards.reverse())
    })
    
    .catch(err => console.log(err))
  }}, [isLoggedIn])


  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser.user._id);
    api.updateLikes(isLiked, card.id)
    .then((newCard) => {
      const newCardFromServer = newCard.card
      newCardFromServer.key = card.id
      newCardFromServer.id = card.id
      setCards((state) => {
        return state.map(c => c.id === card.id ? newCardFromServer : c)
      })
    })
    .catch(err => console.log(err))
  }

  function handleCardDelete(card) {
    api.deleteCard(card.id)
    .then((data) => {
      setCards((state) => {
        return state.filter(j => j.id !== card.id && data)
      })
    })
    .catch(res => console.log(res))
  }
  
  function handleUpdateUser(dataPopup) {
    api.editUserProfile(dataPopup)
    .then((data) => {
     setCurrentUser(data)
     closeAllPopups()
    })
    .catch(res => console.log(res))
  }

  function handleUpdateAvatar(dataPopup) {
    api.editAvatar(dataPopup)
    .then((data) => {
      setCurrentUser(data)
     closeAllPopups()
    })
    .catch(res => console.log(res))
  }

  function handleAddPlaceSubmit(data) {
    api.sentNewCard(data)
    .then((newCard) => {
      const newCardFromServer = newCard.card
      newCardFromServer.key = newCardFromServer._id
      newCardFromServer.id = newCardFromServer._id
      setCards([newCardFromServer, ...cards])
      closeAllPopups()
    })
    .catch(res => console.log(res))
  }

  const liginOut = () => {
    localStorage.removeItem('jwt');
    setIsLoggedIn(false)
    history.push('/login')
}


    return (
      <div className="page">
        <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path="/main">
            <Header
              email={<p className="header__link">{dataUserForHomePage.email}</p>}
              exit={<Link onClick={liginOut} to="/login" className="header__link" >??????????</Link>}
            />
          </Route>
        </Switch> 
        <Switch>
        <Route path="/login">
          <Header register={<Link to="/register" className="header__link">??????????????????????</Link>}/>
          <Login onLogin={handleLogin} loggedIn={isLoggedIn} />
        </Route>  
        <Route path="/register">
          <Header entrance={<Link to="/login" className="header__link" >??????????</Link>}/>
            <Register loggedIn={isLoggedIn} onRegister={handleRegister} />
          </Route>  
        <ProtectedRoute path="/main"
          component={Main}
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick} 
          onEditAvatar={handleEditAvatarClick} 
          onSelectedCard={handleCardClick} 
          cards={cards} 
          onCardLike={handleCardLike} 
          onCardDelete={handleCardDelete}
          loggedIn={isLoggedIn}
          />  
          <Route exact path="/">
            {isLoggedIn ? <Redirect to="/main" /> : <Redirect to="/login" />}
          </Route>
          </Switch>
        <Footer />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
        <PopupWithForm name={'popup_confirm'} title={'???? ??????????????&quest;'} buttonText={'????'} />
        <ImagePopup card={selectedCard} {...selectedCard} onClose={closeAllPopups} />
        <InfoTooltip title="???? ?????????????? ????????????????????????????????????!" link={success} name="info-tooltip" isOpen={isSuccessInfoRegister} onClose={closeAllPopups} />
        <InfoTooltip title="??????-???? ?????????? ???? ??????! ???????????????????? ?????? ??????." link={disaster} name="info-tooltip" isOpen={isDisasterInfoRegister} onClose={closeAllPopups} />
        </CurrentUserContext.Provider>
      </div>
    )
  }

  export {App};