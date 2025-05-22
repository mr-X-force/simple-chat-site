function createGroup() {
    let groupName = prompt("Enter Group Name:");
    if (groupName) {
        let groupList = document.getElementById("group-list");
        let newGroup = document.createElement("li");
        newGroup.innerText = groupName;
        groupList.appendChild(newGroup);
    }
}
