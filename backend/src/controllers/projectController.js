import { createProjectService, getProjectTreeService } from "../service/projectService.js"


export const createPostController = async (req, res) => {

    const projectId = await createProjectService()

    res.status(200).json({
        data: projectId,
        "message": "Project created successfully"
    })

}


export const getProjectTree = async (req, res) => {
    const tree = getProjectTreeService(req.params.projectId)

    res.status(200).json({
        message: "Fetched the tee",
        success: true,
        data: tree
    })
}