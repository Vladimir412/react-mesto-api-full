
const BaseUrl = 'https://api.mesto-vladimir.nomoredomains.rocks'

   export const register = (email, password) => {
        return fetch(`${BaseUrl}/signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({email, password})
        })
        .then(checkResponse)
    }

    export const login = (email, password) => {
        return fetch(`${BaseUrl}/signin`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "text/html, application/xhtml+xml"
            },
            body: JSON.stringify({email, password})
        })
        .then(checkResponse)
        .then(data => {
            return data
        })
    }

    export const getDataUser = (token) => {
        return fetch(`${BaseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`
            }
        })
        .then(checkResponse)
    }

    const checkResponse = (res) => {
        return res.ok? res.json() : Promise.reject(console.log(res))
    }