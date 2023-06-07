class SessionStorage {
    /**
     * @type {object}
     */
    #database = {};

    /**
     * @param {string | int} key
     * @param {object} data
     */
    setData(key, data) {
        if (this.#database[key] === undefined) this.database[key] = data;
        else {
            this.#database[key] = {
                ...this.#database[key],
                ...data,
            };
        }
    }

    /**
     * @param {string | int} key
     * @returns {object | undefined}
     */
    getData(key) {
        return this.#database[key];
    }

    /**
     * @param {string | int} key
     */
    createKey(key) {
        if (this.#database[key] === undefined) this.#database[key] = {};
    }

    /**
     * @param {string | int} key
     */
    removeKey(key) {
        delete this.#database[key];
    }
}

const sessionStorage = new SessionStorage();

module.exports = sessionStorage;
