/* eslint-disable */
import React from 'react'
import Form from './Form.js'
import Post from './Post.js'
import Home from './Home.js'
import ShowQuiz from './shownQuiz.js'

let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'https://mighty-brook-52509.herokuapp.com/api/quizzes'
} else {
  baseUrl = 'https://mighty-brook-52509.herokuapp.com/api/quizzes'
}

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  fetchPosts = () => {
    fetch(`${baseUrl}`)
    .then(data=>data.json())
    .then(jData=> {
      this.setState({posts:jData})
    }).catch(err=>console.log(err))
  }

  showPost = (showData) =>  {
    fetch(`${baseUrl}/${showData.id}`,  {
      body: JSON.stringify(showData),
      method: "GET",
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(this.props.handleView())
  }

  handleCreate = (createData) => {
    fetch(`${baseUrl}`, {
      body: JSON.stringify(createData),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(createdPost => {
      return createdPost.json()
    }).then(jsonedPost => {
      this.props.handleView('home')
      this.setState(prevState => {
        prevState.posts = jsonedPost
        return {
          posts: prevState.posts
        }
      })
    }).catch(err => console.log(err))
  }

  handleUpdate = (updateData) => {
    fetch(`${baseUrl}/${updateData.id}`, {
      body: JSON.stringify(updateData),
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(updatedPost => {
        this.props.handleView('viewQuizzes')
        this.fetchPosts()
      })
      .catch(err => console.log(err))
  }

  handleDelete = (id) => {
    fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
        .then(json => {
         this.fetchPosts()
       })
      //   this.setState(prevState => {
      //   const posts = prevState.posts.filter(post => post.id !== id)
      //   return { posts }
      // })
      // })
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.fetchPosts()
  }


  render() {
    return (
      <main>
        {
          this.props.view.page === 'home' ?
          <Home />
          : this.props.view.page ==='viewQuizzes' ? this.state.posts.map((postData) => (
          <Post
            key={postData.id}
            postData={postData}
            handleView={this.props.handleView}
            handleDelete={this.handleDelete}
          /> ))
          : this.props.view.page === 'showQuiz' ?
          <ShowQuiz
            showPosts={this.showPost}
            handleView={this.props.handleView}
            quizData={this.props.quizData}
            />
          :
          <Form
            handleCreate={this.handleCreate}
            handleUpdate={this.handleUpdate}
            formInputs={this.props.formInputs}
            view={this.props.view}
           />
      }
      </main>
    )
  }

}

export default Main;
