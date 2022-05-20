let arr1 = [
    {
        id: 1,
        title: 'Todo 1',
        description: 'Description 1',
    },
    {
        id: 2,
        title: 'Todo 2',
    },
    {
        id: 1,
        title: 'Todo 3',
    }
]
console.log(arr1)

let item = arr1.find(item => item.id === 1)
let itemIndex = arr1.indexOf(item)
arr1[itemIndex] = {
    id: 1,
    title: 'Todo title',
    description: 'Description changed',
}
console.log(arr1)