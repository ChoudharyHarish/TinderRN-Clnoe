const getMatchedUserInfo = (users, userLoggedID) => {
    const newUsers = {...users};
    delete newUsers[userLoggedID];
    const [id,user] = Object.entries(newUsers).flat();
    return {id,user};
}

export default getMatchedUserInfo;