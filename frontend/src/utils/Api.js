
class Api {
    constructor({baseUrl, authorization}) {
        this._url = baseUrl;
        this._token = authorization;
    }



    getInfoAboutUser() {
        return fetch(`${this._url}/users/me`, {
            method: 'GET',
            headers: {
                authorization: this._token
                }
        })
        .then(this._checkResponse)
    }

    getInitialCards() {
        return fetch(`${this._url}/cards`, {
            headers: {
                authorization: this._token,
                }
            })
            .then(this._checkResponse)
    }

    editUserProfile(data) {
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: {
                authorization: this._token,
                'Content-Type': 'application/json',
                "Accept": "text/html, application/xhtml+xml"
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
                'Content-Type': 'application/json',
                "Accept": "text/html, application/xhtml+xml"
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
                'Content-Type': 'application/json',
                "Accept": "text/html, application/xhtml+xml"
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
                'Content-Type': 'application/json',
                "Accept": "text/html, application/xhtml+xml"
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

export default Api