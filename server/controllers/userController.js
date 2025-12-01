import sql from "../configs/db.js";

export const getUserCreations=async(req,res)=>{
 try {
    const {userId}=req.auth()
const creations=await sql `SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
res.json({success:true,creations}) 
} catch (error) {
    res.json({success:false,message:error.message})
 }   
}

export const getPublishedCreations=async(req,res)=>{
 try {

const creations= await sql `SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
res.json({success:true,creations}) 
} catch (error) {
    res.json({success:false,message:error.message})
 }   
}

// export const toggleLikeCreations = async (req, res) => {
//   try {
//     const { userId } = req.auth()
//     const { id } = req.body

//     const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

//     if (!creation) {
//       return res.json({ success: false, message: "Creation not Found" })
//     }

//     const currentLikes = creation.likes || []
//     const userIdStr = userId.toString()
//     let updatedLikes
//     let message

//     if (currentLikes.includes(userIdStr)) {
//       // FIXED: Change == to !== to actually remove the user
//       updatedLikes = currentLikes.filter((user) => user !== userIdStr)
//       message = 'Creation Unliked'
//     } else {
//       updatedLikes = [...currentLikes, userIdStr]
//       message = 'Creation Liked'
//     }

//     const formattedArray = `{${updatedLikes.join(',')}}`

//     await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`

//     res.json({ success: true, message, likes: updatedLikes })
//   } catch (error) {
//     res.json({ success: false, message: error.message })
//   }
// }






export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth()
    const { id } = req.body

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

    if (!creation) {
      return res.json({ success: false, message: "Creation not Found" })
    }

    // Get current likes - handle as array
    let currentLikes = creation.likes || []
    
    // Ensure it's an array
    if (!Array.isArray(currentLikes)) {
      currentLikes = []
    }

    const userIdStr = userId.toString()
    let updatedLikes
    let message

    console.log('Current likes:', currentLikes)
    console.log('User ID:', userIdStr)
    console.log('User already liked:', currentLikes.includes(userIdStr))

    if (currentLikes.includes(userIdStr)) {
      // Remove user from likes
      updatedLikes = currentLikes.filter((user) => user !== userIdStr)
      message = 'Creation Unliked'
    } else {
      // Add user to likes
      updatedLikes = [...currentLikes, userIdStr]
      message = 'Creation Liked'
    }

    console.log('Updated likes:', updatedLikes)

    // Format as PostgreSQL array
    const formattedArray = updatedLikes.length > 0 
      ? `{${updatedLikes.join(',')}}` 
      : '{}'

    console.log('Formatted array:', formattedArray)

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`

    res.json({ 
      success: true, 
      message, 
      likes: updatedLikes,
      likeCount: updatedLikes.length 
    })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.json({ success: false, message: error.message })
  }
}