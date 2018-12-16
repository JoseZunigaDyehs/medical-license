const graphql = require("graphql"),
    _ = require("lodash"),
    Score = require("../models/score"),
    Crew = require("../models/crew"),
    User = require("../models/user"),
    Work = require("../models/work"),
    WorkState = require("../models/workState")

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull } = graphql; 

//DATA
const crews = [
    { id: "1", name: "Familia Perez", scoreId:"4" },
    { id: "2", name: "Los Florindos", scoreId:"2"},
    { id: "3", name: "Familia Bacan", scoreId:"1"}
];

const users = [
    { id: "1", name: "Perro", age: 5 , crewId: '1', scoreId:"3", worksId:["1","3"]},
    { id: "2", name: "Sapo", age: 8 , crewId: '2', scoreId:"5", worksId:["1","4"]},
    { id: "3", name: "Vaca", age: 12 , crewId: '3', scoreId:"2", worksId:["2","3"]},
    { id: "4", name: "Gato", age: 5 , crewId: '3', scoreId:"5", worksId:["1"]},
    { id: "5", name: "Jirafa", age: 88 , crewId: '3', scoreId:"2", worksId:["2","3"]},
    { id: "6", name: "Elefante", age: 45 , crewId: '1', scoreId:"4", worksId:["1","4"]},
];

const scores = [
    { id: "1", value: 1, name: "Horrendo"},
    { id: "2", value: 2, name: "Malo"},
    { id: "3", value: 3, name: "Regular"},
    { id: "4", value: 4, name: "Bueno"},
    { id: "5", value: 5, name: "Excelente"},
];

const works = [
    { id: "1", name:"cocinar", createdDate:"", workStateId: "1", doneDate: "" },
    { id: "2", name:"lavar loza", createdDate:"", workStateId: "2", doneDate: "" },
    { id: "3", name:"regar", createdDate:"", workStateId: "3", doneDate: "" },
    { id: "4", name:"dormir", createdDate:"", workStateId: "1", doneDate: "" },
]

const workStates = [
    { id: "1", name: "Pendiente"},
    { id: "2", name: "En curso"},
    { id: "3", name: "Hecho"},
];

//TYPES
const CrewType = new GraphQLObjectType({
    name: 'Crew',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        users: { 
            type: new GraphQLList(UserType),
            resolve(parent,args){
                // return _.filter(users,{crewId:parent.id})
                return User.find({crewId:parent.id})
            }
        },
        scoreId: { type: GraphQLID },
        score: {
            type: ScoreType,
            resolve(parent,args){
                //console.log(Score.findById({id:parent.scoreId}))
                return Score.findById(parent.scoreId)
                // return _.find(scores,{id:parent.scoreId})
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        crewId: { type: GraphQLID },
        crew: {
            type: CrewType,
            resolve(parent,args){
                // return _.find(crews,{id:parent.crewId})
                return Crew.findById(parent.crewId);
            }
        },
        scoreId: { type: GraphQLID },
        score: {
            type: ScoreType,
            resolve(parent,args){
                return Score.findById(parent.scoreId)
                // return _.find(scores,{id:parent.scoreId})
            }
        },
        worksId: { type: new GraphQLList(GraphQLID)},
        works: {
            type: new GraphQLList(WorkType),
            resolve(parent,args){
                return parent.worksId.map((workId)=>{
                    return Work.findById(workId)
                    // return _.find(works,{id:workId})
                })
            }
        }
    })
})

const ScoreType = new GraphQLObjectType({
    name: 'Score',
    fields: () => ({
        id: { type: GraphQLID },
        value: { type: GraphQLInt },
        name: { type: GraphQLString },
        crews: {
            type: new GraphQLList(CrewType),
            resolve(parent,args){
                return Crew.find({scoreId:parent.id})
                // return _.filter(crews,{scoreId:parent.id})
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return User.find({scoreId:parent.id})
                // return _.filter(users,{scoreId:parent.id})
            }
        }
    })
})

const WorkType = new GraphQLObjectType({
    name: "Work",
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString},
        workStateId: { type: GraphQLID},
        state: {
            type: WorkStateType,
            resolve(parent,args){
                return WorkState.findById(parent.workStateId);
                // return _.find(workStates,{id:parent.workStateId})
            }
        }
    })
})

const WorkStateType = new GraphQLObjectType({
    name: "WorkState",
    fields: () => ({
        id: {type:GraphQLID},
        name: {type:GraphQLString}
    })
})

//QUERYS
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        crew:{
            type: CrewType,
            args: { id: { type: GraphQLID } },
            resolve(parent,args){
                return Crew.findById(args.id)
            }
        },
        crews:{
            type: new GraphQLList(CrewType),
            resolve(parent,args){
                return Crew.find({})
            }
        },
        user:{
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent,args){
                return User.findById(args.id)
            }
        },
        users:{
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return User.find({})
            }
        },
        score:{
            type: ScoreType,
            args: { id: { type: GraphQLID } },
            resolve(parent,args){
                // return _.find(scores,{id:args.id})
                return Score.findById(args.id)
            }
        },
        scores:{
            type: new GraphQLList(ScoreType),
            resolve(parent,args){
                return Score.find({})
            }
        },
        work:{
            type: WorkType,
            args: { id: { type: GraphQLID }},
            resolve(parent,args){
                return Work.findById(args.id)
            }
        },
        works:{
            type: new GraphQLList(WorkType),
            resolve(parent,args){
                return Work.find({})
            }
        },
        workState:{
            type: WorkStateType,
            args: { id: { type: GraphQLID }},
            resolve(parent,args){
                return WorkState.findById(args.id)
            }
        },
        workStates:{
            type: new GraphQLList(WorkStateType),
            resolve(parent,args){
                return WorkState.find({})
            }
        },
    }
})

//MUTATION
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCrew: {
            type: CrewType,
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
                scoreId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent,args){
                let crew = new Crew({
                    name: args.name,
                    scoreId: args.scoreId
                });
                return crew.save();
            }
        },
        addScore: {
            type: ScoreType,
            args:{
                value: { type: GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent,args){
                let score = new Score({
                    value: args.value,
                    name: args.name
                });
                return score.save();
            }
        },
        addWorkState: {
            type: WorkStateType,
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent,args){
                let workstate = new WorkState({
                    name: args.name
                });
                return workstate.save();
            }
        },
        addWork: {
            type: WorkType,
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
                createdDate: { type: GraphQLNonNull(GraphQLString)},
                doneDate: { type: GraphQLNonNull(GraphQLString)},
                workStateId: { type: GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let work = new Work({
                    name: args.name,
                    createdDate: args.createdDate,
                    doneDate: args.doneDate,
                    workStateId: args.workStateId
                });
                return work.save();
            }
        },
        addUser: {
            type: UserType,
            args:{
                name: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt)},
                crewId: { type: GraphQLID},
                scoreId: { type: GraphQLNonNull(GraphQLID)},
                worksId: { type: new GraphQLList(GraphQLID)}
            },
            resolve(parent,args){
                let user = new User({
                    name: args.name,
                    age: args.age,
                    crewId: args.crewId,
                    scoreId: args.scoreId,
                    worksId: args.worksId
                });
                return user.save();
            }
        }
    }
})

module.exports= new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})