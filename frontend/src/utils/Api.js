import {token} from '../components/App';

class Api {
    constructor({baseUrl, authorization}) {
        this._url = baseUrl;
        this._token = authorization;
        // this._userId = userId;
    }



    getInfoAboutUser() {
        return fetch(`${this._url}/users/me`, {
            headers: {
                authorization: this._token
                }
        })
        .then(this._checkResponse)
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: {
                authorization: this._token
                }
            })
            .then(this._checkResponse)
    }

    editUserProfile(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.firstname,
                about: data.profession
            })
        })
        .then(this._checkResponse)

    }

    sentNewCard(data) {
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                link: data.link
            })
        })
        .then(this._checkResponse)
    }

    editAvatar(data) {
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: data.avatar
            })
        })
        .then(this._checkResponse)
    }

    updateLikes(liked, id) {
        return fetch(`${this._url}/cards/${id}/likes`, {
            method: liked ? 'DELETE' : 'PUT',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        })
        .then(this._checkResponse)
    }

    deleteCard(data) {
      return fetch(`${this._url}/cards/${data}`, {
        method: 'DELETE',
        headers: {
          authorization: this._token
        }
      })
      .then(this._checkResponse)
    }

    _checkResponse(res) {
        return res.ok? res.json() : Promise.reject(`Ошибка: ${res}`)
    }
}

// const api = new Api({
//     baseUrl: 'https://mesto.nomoreparties.co',
//     authorization: 'b6b35178-16fa-4e7f-8f36-adf75a68e4d9',
//     userId: 'cohort-26'
//   })

const api = new Api ({
    baseUrl: 'api.mesto-vladimir.nomoredomains.rocks',
    authorization: `${token}`,
    // userId: '',
})

export default api