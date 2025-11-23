import React, { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

/* Small presentational card for a project */
const ProjectCard = ({ project, onOpen }) => {
    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onOpen(project)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            <h2 className="font-semibold">{project.name || 'Untitled Project'}</h2>
            <div className="flex gap-2 text-sm text-gray-600 items-center">
                <small className="flex items-center gap-1">
                    <i className="ri-user-line" /> Collaborators:
                </small>
                <span>{Array.isArray(project.users) ? project.users.length : 0}</span>
            </div>
        </div>
    )
}

/* Reusable modal for creating a project */
const CreateProjectModal = ({ isOpen, initialValue = '', onClose, onCreate }) => {
    const [name, setName] = useState(initialValue)

    useEffect(() => {
        if (isOpen) setName(initialValue)
    }, [isOpen, initialValue])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim()) return
        onCreate(name.trim())
        setName('') // reset input after submission
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
                <h2 className="text-xl mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md mb-4"
                        required
                        aria-label="Project name"
                        autoFocus
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const fetchProjects = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get('/projects/all')
            setProjects(Array.isArray(res.data.projects) ? res.data.projects : [])
        } catch (err) {
            console.error(err)
            setError('Failed to load projects')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleCreateProject = useCallback(
        async (name) => {
            try {
                const res = await axios.post('/projects/create', { name })
                const created = res.data.project
                // append created project (avoid duplicates)
                setProjects((prev) => (prev.some(p => p._id === created._id) ? prev : [...prev, created]))
                setIsModalOpen(false)
            } catch (err) {
                console.error(err)
                setError('Could not create project')
            }
        },
        []
    )

    const openProject = (project) => {
        navigate(`/project`, { state: { project } })
    }

    return (
        <main className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                    aria-label="Create new project"
                >
                    New Project <i className="ri-link" />
                </button>
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : projects.length === 0 ? (
                <p>No projects found</p>
            ) : (
                <div className="projects flex flex-wrap gap-3">
                    {projects.map((project) => (
                        <ProjectCard key={project._id || Math.random()} project={project} onOpen={openProject} />
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </main>
    )
}

export default Home
