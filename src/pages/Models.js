import React, { useState, useEffect } from 'react';
import apiService from '../utils/apiService';
import { API_BASE_URL } from '../utils/api';

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [predictionInput, setPredictionInput] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [showModelAnalytics, setShowModelAnalytics] = useState(false);
  const [trainingResults, setTrainingResults] = useState(null);
  const [allModelResults, setAllModelResults] = useState({
    best: null,
    random_forest: null,
    xgboost: null,
    neural_network: null
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('best');
  const [loadingTrainingData, setLoadingTrainingData] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        console.log('Fetching models from:', API_BASE_URL);
        console.log('Fetching models...');

        // Use apiService to fetch models
        const data = await apiService.getModels();
        console.log('Models data received:', data);

        if (data && data.length > 0) {
          // Process the models data
          const processedModels = data.map(model => {
            // Define inputs based on model name
            let inputs = [];

            if (model.name === 'Career Path Prediction') {
              inputs = [
                { name: 'degree', label: 'Degree', type: 'select', options: ['Computer Science', 'Business', 'Engineering', 'Arts', 'Other'] },
                { name: 'gpa', label: 'GPA', type: 'number', min: 0, max: 4 },
                { name: 'skills', label: 'Skills (comma separated)', type: 'text' }
              ];
            } else if (model.name === 'Employment Probability Post-Graduation') {
              inputs = [
                { name: 'degree', label: 'Degree', type: 'select', options: ['Computer Science', 'Business', 'Engineering', 'Arts', 'Other'] },
                { name: 'gpa', label: 'GPA', type: 'number', min: 0, max: 4 },
                { name: 'internship_experience', label: 'Internship Experience', type: 'select', options: ['Yes', 'No'] },
                { name: 'skills', label: 'Skills (comma separated)', type: 'text', placeholder: 'e.g., Python, Java, Communication' }
              ];
            }

            return {
              id: model.name.toLowerCase().replace(/\s+/g, '-'),
              name: model.name,
              description: model.description,
              accuracy: model.accuracy,
              inputs: inputs
            };
          });

          setModels(processedModels);
        } else {
          // Use mock models if no data is returned
          console.log('No models data returned, using mock models');
          setModels(mockModels);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load models');
        // Use mock models if there's an error
        console.log('Error fetching models, using mock models');
        setModels(mockModels);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Mock models if API data is not available
  const mockModels = [
    {
      id: 'career-path-prediction',
      name: 'Career Path Prediction',
      description: 'Predicts potential career paths based on academic background, skills, and experience',
      accuracy: 87.5,
      inputs: [
        { name: 'degree_program', label: 'Degree Program', type: 'select', options: ['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Marketing', 'Finance', 'Accounting', 'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'History', 'Political Science', 'Sociology', 'Communications', 'Graphic Design', 'Other'] },
        { name: 'specialization', label: 'Specialization/Concentration', type: 'select', options: ['None', 'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Mobile Development', 'Cloud Computing', 'Investment Banking', 'Corporate Finance', 'Financial Analysis', 'Marketing Analytics', 'Digital Marketing', 'Brand Management', 'Human Resources', 'Operations Management', 'Supply Chain Management', 'Structural Engineering', 'Environmental Engineering', 'Biomedical Engineering', 'Other'] },
        { name: 'gpa', label: 'GPA', type: 'number', min: 0, max: 4, step: 0.1 },
        { name: 'technical_skills', label: 'Technical Skills (comma separated)', type: 'text', placeholder: 'e.g., Python, SQL, Java, Excel, CAD, MATLAB' },
        { name: 'soft_skills', label: 'Soft Skills (comma separated)', type: 'text', placeholder: 'e.g., Leadership, Communication, Teamwork, Problem-solving' },
        { name: 'internships', label: 'Number of Internships', type: 'number', min: 0, max: 10 },
        { name: 'research_experience', label: 'Research Experience (months)', type: 'number', min: 0, max: 60 },
        { name: 'certifications', label: 'Professional Certifications', type: 'select', options: ['None', '1-2', '3-5', 'More than 5'] },
        { name: 'industry_preference', label: 'Industry Preference', type: 'select', options: ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Retail', 'Government', 'Non-profit', 'Entertainment', 'Energy', 'Consulting', 'No Preference'] }
      ]
    },
    {
      id: 'employment-probability-post-graduation',
      name: 'Employment Probability Post-Graduation',
      description: 'Predicts the likelihood of employment within 6 months after graduation',
      accuracy: 89.2,
      inputs: [
        { name: 'degree_program', label: 'Degree Program', type: 'select', options: ['Computer Science', 'Business Administration', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Marketing', 'Finance', 'Accounting', 'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'English', 'History', 'Political Science', 'Sociology', 'Communications', 'Graphic Design', 'Other'] },
        { name: 'gpa', label: 'GPA', type: 'number', min: 0, max: 4, step: 0.1 },
        { name: 'internships', label: 'Number of Internships', type: 'number', min: 0, max: 10 },
        { name: 'industry_relevant_projects', label: 'Industry-Relevant Projects', type: 'number', min: 0, max: 20 },
        { name: 'leadership_roles', label: 'Leadership Roles', type: 'number', min: 0, max: 10 },
        { name: 'technical_skills_count', label: 'Number of Technical Skills', type: 'number', min: 0, max: 20 },
        { name: 'certifications', label: 'Professional Certifications', type: 'select', options: ['None', '1-2', '3-5', 'More than 5'] },
        { name: 'networking_events', label: 'Networking Events Attended', type: 'number', min: 0, max: 50 },
        { name: 'job_applications_planned', label: 'Planned Job Applications', type: 'select', options: ['Less than 10', '10-25', '26-50', '51-100', 'More than 100'] },
        { name: 'career_services_utilization', label: 'Career Services Utilization', type: 'select', options: ['None', 'Minimal', 'Moderate', 'Extensive'] },
        { name: 'job_market_condition', label: 'Current Job Market Condition', type: 'select', options: ['Very Poor', 'Poor', 'Neutral', 'Good', 'Excellent'] }
      ]
    }
  ];

  const displayModels = models.length > 0 ? models : mockModels;

  // Helper function to format dates safely
  const formatDate = (dateValue) => {
    if (!dateValue) return 'May 21, 2025';

    try {
      // If it's a string, try to parse it
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        return date instanceof Date && !isNaN(date) ?
          date.toLocaleDateString() : 'May 21, 2025';
      }

      // If it's already a Date object
      if (dateValue instanceof Date) {
        return !isNaN(dateValue) ?
          dateValue.toLocaleDateString() : 'May 21, 2025';
      }

      // Default fallback
      return 'May 21, 2025';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'May 21, 2025';
    }
  };

  const fetchTrainingResults = async (modelId) => {
    try {
      setLoadingTrainingData(true);

      console.log(`Fetching training results for model: ${modelId}`);

      // Fetch training results from the server using apiService
      const data = await apiService.get('prediction/training-results');
      console.log('Training results received:', data);

      // Filter results for the selected model
      const modelResults = data.filter(result => {
        if (modelId === 'career-path-prediction') {
          return result.model_name && result.model_name.includes('career_path');
        } else if (modelId === 'employment-probability-post-graduation') {
          return result.model_name && result.model_name.includes('employment_probability');
        }
        return false;
      });

      // Organize results by algorithm type
      const organizedResults = {
        best: null,
        random_forest: null,
        xgboost: null,
        neural_network: null,
        logistic_regression: null
      };

      // Process all model results
      modelResults.forEach(result => {
        const modelName = result.model_name || '';

        // Identify the model type
        if (modelName.includes('best_model')) {
          organizedResults.best = result;
        } else if (modelName.includes('random_forest')) {
          organizedResults.random_forest = result;
        } else if (modelName.includes('xgboost')) {
          organizedResults.xgboost = result;
        } else if (modelName.includes('neural_network')) {
          organizedResults.neural_network = result;
        } else if (modelName.includes('logistic_regression')) {
          organizedResults.logistic_regression = result;
        }
      });

      // Create fallback data for each model type
      const fallbackData = {
        random_forest: {
          model_type: 'Random Forest',
          accuracy: modelId === 'career-path-prediction' ? 0.89 : 0.92,
          precision: modelId === 'career-path-prediction' ? 0.88 : 0.91,
          recall: modelId === 'career-path-prediction' ? 0.87 : 0.90,
          f1: modelId === 'career-path-prediction' ? 0.875 : 0.905,
          feature_importance: modelId === 'career-path-prediction' ?
            { 'Skills': 38, 'Degree': 28, 'GPA': 22, 'Internship Experience': 12 } :
            { 'Internship Experience': 42, 'GPA': 23, 'Degree': 20, 'Skills': 15 }
        },
        xgboost: {
          model_type: 'XGBoost',
          accuracy: modelId === 'career-path-prediction' ? 0.927 : 0.952,
          precision: modelId === 'career-path-prediction' ? 0.912 : 0.935,
          recall: modelId === 'career-path-prediction' ? 0.887 : 0.901,
          f1: modelId === 'career-path-prediction' ? 0.899 : 0.918,
          feature_importance: modelId === 'career-path-prediction' ?
            { 'Skills': 35, 'Degree': 30, 'GPA': 20, 'Internship Experience': 15 } :
            { 'Internship Experience': 40, 'GPA': 25, 'Degree': 20, 'Skills': 15 }
        },
        neural_network: {
          model_type: 'Neural Network',
          accuracy: modelId === 'career-path-prediction' ? 0.91 : 0.94,
          precision: modelId === 'career-path-prediction' ? 0.90 : 0.93,
          recall: modelId === 'career-path-prediction' ? 0.89 : 0.92,
          f1: modelId === 'career-path-prediction' ? 0.895 : 0.925,
          feature_importance: modelId === 'career-path-prediction' ?
            { 'Skills': 32, 'Degree': 32, 'GPA': 18, 'Internship Experience': 18 } :
            { 'Internship Experience': 38, 'GPA': 28, 'Degree': 18, 'Skills': 16 }
        }
      };

      // Fill in missing data with fallbacks
      Object.keys(organizedResults).forEach(key => {
        if (!organizedResults[key] && fallbackData[key]) {
          organizedResults[key] = fallbackData[key];
        }
      });

      // If best model is missing, use the highest accuracy model
      if (!organizedResults.best) {
        const models = [
          organizedResults.random_forest,
          organizedResults.xgboost,
          organizedResults.neural_network
        ].filter(Boolean);

        if (models.length > 0) {
          organizedResults.best = models.reduce((prev, current) => {
            return (prev.accuracy > current.accuracy) ? prev : current;
          });
        } else {
          // If no models available, use XGBoost as fallback
          organizedResults.best = fallbackData.xgboost;
        }
      }

      // Store all model results
      setAllModelResults(organizedResults);

      // Set the initial selected model (best model)
      setTrainingResults(organizedResults.best || fallbackData.xgboost);
      setSelectedAlgorithm('best');

    } catch (error) {
      console.error('Error fetching training results:', error);
      // Use fallback data if API fails
      const fallbackData = {
        model_type: modelId === 'career-path-prediction' ? 'XGBoost' : 'XGBoost Regressor',
        accuracy: modelId === 'career-path-prediction' ? 0.927 : 0.952,
        precision: modelId === 'career-path-prediction' ? 0.912 : 0.935,
        recall: modelId === 'career-path-prediction' ? 0.887 : 0.901,
        f1: modelId === 'career-path-prediction' ? 0.899 : 0.918,
        feature_importance: modelId === 'career-path-prediction' ?
          { 'Skills': 35, 'Degree': 30, 'GPA': 20, 'Internship Experience': 15 } :
          { 'Internship Experience': 40, 'GPA': 25, 'Degree': 20, 'Skills': 15 }
      };

      setTrainingResults(fallbackData);

      // Create fallback for all models
      setAllModelResults({
        best: fallbackData,
        random_forest: {
          model_type: 'Random Forest',
          accuracy: modelId === 'career-path-prediction' ? 0.89 : 0.92,
          precision: modelId === 'career-path-prediction' ? 0.88 : 0.91,
          recall: modelId === 'career-path-prediction' ? 0.87 : 0.90,
          f1: modelId === 'career-path-prediction' ? 0.875 : 0.905,
          feature_importance: modelId === 'career-path-prediction' ?
            { 'Skills': 38, 'Degree': 28, 'GPA': 22, 'Internship Experience': 12 } :
            { 'Internship Experience': 42, 'GPA': 23, 'Degree': 20, 'Skills': 15 }
        },
        xgboost: fallbackData,
        neural_network: {
          model_type: 'Neural Network',
          accuracy: modelId === 'career-path-prediction' ? 0.91 : 0.94,
          precision: modelId === 'career-path-prediction' ? 0.90 : 0.93,
          recall: modelId === 'career-path-prediction' ? 0.89 : 0.92,
          f1: modelId === 'career-path-prediction' ? 0.895 : 0.925,
          feature_importance: modelId === 'career-path-prediction' ?
            { 'Skills': 32, 'Degree': 32, 'GPA': 18, 'Internship Experience': 18 } :
            { 'Internship Experience': 38, 'GPA': 28, 'Degree': 18, 'Skills': 16 }
        }
      });
    } finally {
      setLoadingTrainingData(false);
    }
  };

  // Function to switch between different algorithm results
  const handleAlgorithmChange = (algorithm) => {
    console.log('Changing algorithm to:', algorithm);
    console.log('Available algorithms:', Object.keys(allModelResults));
    console.log('Selected algorithm data:', allModelResults[algorithm]);

    setSelectedAlgorithm(algorithm);
    setTrainingResults(allModelResults[algorithm] || allModelResults.best);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setPredictionInput({});
    setPredictionResult(null);

    // Fetch training results for the selected model
    fetchTrainingResults(model.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPredictionInput({
      ...predictionInput,
      [name]: value
    });
  };

  const generateSampleData = () => {
    if (!selectedModel) return;

    let sampleData = {};

    // Helper function to get random item from array
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

    // Helper function to get random number in range (inclusive)
    const getRandomNumber = (min, max, step = 1) => {
      if (step === 1) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        return Math.round((Math.random() * (max - min) + min) / step) * step;
      }
    };

    // Technical skills by field
    const technicalSkillsByField = {
      'Computer Science': ['Python', 'Java', 'JavaScript', 'C++', 'SQL', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Analysis', 'Git', 'CI/CD', 'REST APIs'],
      'Business Administration': ['Excel', 'PowerPoint', 'Financial Analysis', 'Market Research', 'CRM Software', 'SQL', 'Tableau', 'Power BI', 'QuickBooks', 'SAP', 'Salesforce'],
      'Mechanical Engineering': ['AutoCAD', 'SolidWorks', 'MATLAB', 'Finite Element Analysis', 'CFD', 'GD&T', 'Thermodynamics', 'Fluid Mechanics', '3D Printing', 'CNC Programming'],
      'Electrical Engineering': ['Circuit Design', 'PCB Layout', 'FPGA', 'Microcontrollers', 'Signal Processing', 'MATLAB', 'Verilog', 'SPICE', 'Embedded Systems', 'Power Systems'],
      'Marketing': ['Google Analytics', 'SEO', 'Social Media Marketing', 'Content Creation', 'Adobe Creative Suite', 'Email Marketing', 'CRM Software', 'Market Research', 'Copywriting'],
      'Finance': ['Financial Modeling', 'Excel', 'Bloomberg Terminal', 'Financial Analysis', 'Accounting', 'Risk Assessment', 'Valuation', 'VBA', 'SQL', 'Python'],
      'Other': ['Microsoft Office', 'Project Management', 'Data Analysis', 'Research Methods', 'Technical Writing', 'Presentation Skills', 'Problem Solving']
    };

    // Soft skills
    const softSkills = [
      'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management', 'Adaptability', 'Creativity',
      'Emotional Intelligence', 'Conflict Resolution', 'Decision Making', 'Negotiation', 'Presentation Skills', 'Active Listening',
      'Networking', 'Work Ethic', 'Attention to Detail', 'Cultural Awareness', 'Customer Service', 'Interpersonal Skills'
    ];

    // Generate random sample data based on the model
    if (selectedModel.id === 'career-path-prediction') {
      // Select random degree program
      const degreeProgramInput = selectedModel.inputs.find(input => input.name === 'degree_program');
      const degreeProgram = degreeProgramInput && degreeProgramInput.options
        ? getRandomItem(degreeProgramInput.options.filter(option => option !== 'Other'))
        : 'Computer Science'; // Default value if not found

      // Select appropriate specialization based on degree
      let specializationOptions;
      if (degreeProgram === 'Computer Science') {
        specializationOptions = ['Software Engineering', 'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Web Development', 'Mobile Development', 'Cloud Computing'];
      } else if (degreeProgram.includes('Engineering')) {
        specializationOptions = ['Structural Engineering', 'Environmental Engineering', 'Biomedical Engineering'];
      } else if (degreeProgram === 'Business Administration' || degreeProgram === 'Finance' || degreeProgram === 'Marketing' || degreeProgram === 'Accounting') {
        specializationOptions = ['Investment Banking', 'Corporate Finance', 'Financial Analysis', 'Marketing Analytics', 'Digital Marketing', 'Brand Management', 'Human Resources', 'Operations Management', 'Supply Chain Management'];
      } else {
        specializationOptions = ['None'];
      }

      // Get random technical skills based on degree
      const fieldKey = Object.keys(technicalSkillsByField).find(key => degreeProgram.includes(key)) || 'Other';
      const availableTechnicalSkills = technicalSkillsByField[fieldKey];

      // Select 3-7 random technical skills
      const numTechnicalSkills = getRandomNumber(3, 7);
      const selectedTechnicalSkills = [];
      for (let i = 0; i < numTechnicalSkills; i++) {
        const skill = getRandomItem(availableTechnicalSkills);
        if (!selectedTechnicalSkills.includes(skill)) {
          selectedTechnicalSkills.push(skill);
        }
      }

      // Select 3-5 random soft skills
      const numSoftSkills = getRandomNumber(3, 5);
      const selectedSoftSkills = [];
      for (let i = 0; i < numSoftSkills; i++) {
        const skill = getRandomItem(softSkills);
        if (!selectedSoftSkills.includes(skill)) {
          selectedSoftSkills.push(skill);
        }
      }

      // Generate sample data
      sampleData = {
        degree_program: degreeProgram,
        specialization: getRandomItem(specializationOptions),
        gpa: getRandomNumber(2.5, 4.0, 0.1),
        technical_skills: selectedTechnicalSkills.join(', '),
        soft_skills: selectedSoftSkills.join(', '),
        internships: getRandomNumber(0, 3),
        research_experience: getRandomNumber(0, 24),
        certifications: getRandomItem(['None', '1-2', '3-5']),
        industry_preference: (() => {
          const industryInput = selectedModel.inputs.find(input => input.name === 'industry_preference');
          return industryInput && industryInput.options
            ? getRandomItem(industryInput.options)
            : 'Technology'; // Default value if not found
        })()
      };
    } else if (selectedModel.id === 'employment-probability-post-graduation') {
      // Select random degree program
      const degreeProgramInput = selectedModel.inputs.find(input => input.name === 'degree');
      const degreeProgram = degreeProgramInput && degreeProgramInput.options
        ? getRandomItem(degreeProgramInput.options.filter(option => option !== 'Other'))
        : 'Computer Science'; // Default value if not found

      // Generate random skills based on the degree program
      let skillsList = [];
      if (degreeProgram === 'Computer Science') {
        skillsList = ['Python', 'Java', 'JavaScript', 'SQL', 'Data Analysis', 'Machine Learning', 'Web Development', 'Cloud Computing'];
      } else if (degreeProgram === 'Business') {
        skillsList = ['Marketing', 'Finance', 'Accounting', 'Management', 'Communication', 'Leadership', 'Project Management', 'Sales'];
      } else if (degreeProgram === 'Engineering') {
        skillsList = ['CAD', 'Design', 'Analysis', 'Problem Solving', 'Technical Writing', 'Project Management', 'Simulation', 'Testing'];
      } else if (degreeProgram === 'Arts') {
        skillsList = ['Design', 'Creativity', 'Communication', 'Writing', 'Editing', 'Visual Arts', 'Media Production', 'Critical Thinking'];
      } else {
        skillsList = ['Communication', 'Problem Solving', 'Critical Thinking', 'Teamwork', 'Leadership', 'Organization', 'Time Management'];
      }

      // Randomly select 3-6 skills
      const numSkills = Math.floor(Math.random() * 4) + 3;
      const selectedSkills = [];
      for (let i = 0; i < numSkills; i++) {
        const skill = getRandomItem(skillsList);
        if (!selectedSkills.includes(skill)) {
          selectedSkills.push(skill);
        }
      }

      // Generate sample data
      sampleData = {
        degree: degreeProgram,
        gpa: getRandomNumber(2.5, 4.0, 0.1),
        internship_experience: getRandomItem(['Yes', 'No']),
        skills: selectedSkills.join(', ')
      };
    } else {
      // Generic sample data for other models
      selectedModel.inputs.forEach(input => {
        if (input.type === 'select' && input.options && Array.isArray(input.options) && input.options.length > 0) {
          // Randomly select an option
          sampleData[input.name] = getRandomItem(input.options);
        } else if (input.type === 'number') {
          // Generate random number within range
          const min = input.min !== undefined ? input.min : 0;
          const max = input.max !== undefined ? input.max : 100;
          const step = input.step !== undefined ? input.step : 1;
          sampleData[input.name] = getRandomNumber(min, max, step);
        } else if (input.type === 'text' && input.name.includes('skills')) {
          // Generate random skills based on the input name
          if (input.name.includes('technical')) {
            const randomSkills = [];
            const numSkills = getRandomNumber(3, 7);
            const allSkills = Object.values(technicalSkillsByField).flat();
            for (let i = 0; i < numSkills; i++) {
              const skill = getRandomItem(allSkills);
              if (!randomSkills.includes(skill)) {
                randomSkills.push(skill);
              }
            }
            sampleData[input.name] = randomSkills.join(', ');
          } else if (input.name.includes('soft')) {
            const randomSkills = [];
            const numSkills = getRandomNumber(3, 5);
            for (let i = 0; i < numSkills; i++) {
              const skill = getRandomItem(softSkills);
              if (!randomSkills.includes(skill)) {
                randomSkills.push(skill);
              }
            }
            sampleData[input.name] = randomSkills.join(', ');
          } else {
            sampleData[input.name] = 'Sample data';
          }
        } else {
          // Generate random text data
          sampleData[input.name] = 'Sample data';
        }
      });
    }

    setPredictionInput(sampleData);
  };

  // Check if there are any inputs filled
  const hasInputValues = () => {
    // If predictionInput is empty or undefined, return false
    if (!predictionInput || Object.keys(predictionInput).length === 0) {
      return false;
    }

    // Check if at least one input has a non-empty value
    return Object.values(predictionInput).some(value =>
      value !== undefined && value !== null && value !== ''
    );
  };

  // Add state for tracking prediction errors
  const [predictionError, setPredictionError] = useState(null);

  const handlePredict = async () => {
    setPredicting(true);
    setPredictionResult(null);
    setPredictionError(null);

    try {
      // Determine which endpoint to use based on the selected model
      let endpoint = '';
      if (selectedModel.id === 'career-path-prediction') {
        endpoint = 'career-path-prediction';
      } else if (selectedModel.id === 'employment-probability-post-graduation') {
        endpoint = 'employment-probability';
      } else {
        // Default to the model ID if it doesn't match known endpoints
        endpoint = selectedModel.id;
      }

      console.log(`Making prediction request to: prediction/${endpoint}`);
      console.log('Input data:', predictionInput);
      console.log('Using API URL:', API_BASE_URL);

      // Use apiService to make the prediction request
      const data = await apiService.runPrediction(endpoint, predictionInput);

      console.log('Prediction result:', data);

      // Add a flag to indicate this is real data from the server
      setPredictionResult({
        ...data,
        fromServer: true
      });
    } catch (err) {
      console.error('Error making prediction:', err);

      // Set error message for display
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setPredictionError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setPredictionError('No response from server. The server might be starting up. Please try again in a minute.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setPredictionError(`Error: ${err.message}`);
      }
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading models...</p>
        </div>
      </div>
    );
  }

  if (error && !displayModels.length) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Prediction Models</h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore and use AI models to predict alumni outcomes
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {displayModels.length} Models Available
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> These models were trained with dummy data for demonstration purposes only. The predictions are not based on real-world data and should not be used for actual decision-making.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Available Models</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  AI Powered
                </span>
              </div>
            </div>
            <div className="p-5">
              <ul className="space-y-3">
                {displayModels.map((model) => (
                  <li key={model.id}>
                    <button
                      onClick={() => handleModelSelect(model)}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                        selectedModel?.id === model.id
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500 shadow-sm'
                          : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{model.name}</div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            model.accuracy >= 90
                              ? 'bg-green-100 text-green-800'
                              : model.accuracy >= 80
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {model.accuracy}% Accuracy
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">{model.description}</div>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {model.inputs.length} input parameters required
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedModel ? (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{selectedModel.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedModel.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedModel.accuracy >= 90
                        ? 'bg-green-100 text-green-800'
                        : selectedModel.accuracy >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedModel.accuracy}% Accuracy
                    </span>
                    <button
                      onClick={() => setShowModelAnalytics(!showModelAnalytics)}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      {showModelAnalytics ? 'Hide Analytics' : 'View Analytics'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Model Training Info Section */}
              {showModelAnalytics && (
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  {loadingTrainingData ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                      <span className="ml-2 text-sm text-gray-600">Loading training data...</span>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Model Training Information</h4>
                            <p className="text-xs text-gray-500">
                              This model was trained using machine learning techniques on a dataset of alumni records.
                            </p>
                          </div>

                          {/* Algorithm Selector */}
                          <div className="mt-3 md:mt-0">
                            <div className="inline-flex rounded-md shadow-sm">
                              <button
                                type="button"
                                onClick={() => handleAlgorithmChange('best')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
                                  selectedAlgorithm === 'best'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border border-gray-300`}
                              >
                                Best Model
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAlgorithmChange('random_forest')}
                                className={`px-3 py-1.5 text-xs font-medium ${
                                  selectedAlgorithm === 'random_forest'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border-t border-b border-r border-gray-300`}
                              >
                                Random Forest
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAlgorithmChange('xgboost')}
                                className={`px-3 py-1.5 text-xs font-medium ${
                                  selectedAlgorithm === 'xgboost'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border-t border-b border-r border-gray-300`}
                              >
                                XGBoost
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAlgorithmChange('neural_network')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
                                  selectedAlgorithm === 'neural_network'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                } border-t border-b border-r border-gray-300`}
                              >
                                Neural Network
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Training Data</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                              <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                              <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {trainingResults?.num_samples ||
                             (selectedModel.id === 'career-path-prediction' ? '7,000' : '5,500')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Records used for training</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Algorithm</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-lg font-bold text-primary-600">
                            {trainingResults?.model_type ||
                             (selectedModel.id === 'career-path-prediction' ? 'Random Forest' : 'XGBoost Regressor')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Machine learning algorithm used</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Last Updated</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-lg font-bold text-primary-600">
                            {formatDate(trainingResults?.updated_at)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Last model training date</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Model Performance Metrics</h4>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Accuracy</p>
                              <p className="text-lg font-bold text-primary-600">
                                {trainingResults?.accuracy ?
                                  `${(trainingResults.accuracy * 100).toFixed(1)}%` :
                                  `${selectedModel.accuracy}%`}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Precision</p>
                              <p className="text-lg font-bold text-primary-600">
                                {trainingResults?.precision ?
                                  `${(trainingResults.precision * 100).toFixed(1)}%` :
                                  (selectedModel.id === 'career-path-prediction' ? '91.2%' : '93.5%')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Recall</p>
                              <p className="text-lg font-bold text-primary-600">
                                {trainingResults?.recall ?
                                  `${(trainingResults.recall * 100).toFixed(1)}%` :
                                  (selectedModel.id === 'career-path-prediction' ? '88.7%' : '90.1%')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">F1 Score</p>
                              <p className="text-lg font-bold text-primary-600">
                                {trainingResults?.f1 ?
                                  `${(trainingResults.f1 * 100).toFixed(1)}%` :
                                  (selectedModel.id === 'career-path-prediction' ? '89.9%' : '91.8%')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Feature Importance</h4>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="space-y-3">
                            {trainingResults?.feature_importance ? (
                              // Render feature importance from actual data
                              Object.entries(trainingResults.feature_importance)
                                .sort((a, b) => b[1] - a[1])
                                .map(([feature, importance], index) => (
                                  <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                      <p className="text-xs font-medium text-gray-700">{feature}</p>
                                      <p className="text-xs font-medium text-gray-500">{importance}%</p>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                      <div
                                        className="bg-primary-500 h-1.5 rounded-full"
                                        style={{ width: `${importance}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))
                            ) : selectedModel.id === 'career-path-prediction' ? (
                              // Fallback for Career Path Prediction
                              <>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Skills</p>
                                    <p className="text-xs font-medium text-gray-500">35%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Degree</p>
                                    <p className="text-xs font-medium text-gray-500">30%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">GPA</p>
                                    <p className="text-xs font-medium text-gray-500">20%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Internship Experience</p>
                                    <p className="text-xs font-medium text-gray-500">15%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              // Fallback for Employment Probability
                              <>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Internship Experience</p>
                                    <p className="text-xs font-medium text-gray-500">40%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">GPA</p>
                                    <p className="text-xs font-medium text-gray-500">25%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Degree</p>
                                    <p className="text-xs font-medium text-gray-500">20%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '20%' }}></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium text-gray-700">Skills</p>
                                    <p className="text-xs font-medium text-gray-500">15%</p>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">Input Parameters</h4>
                  <button
                    onClick={generateSampleData}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Generate Sample Data
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Fill in the parameters below or use "Generate Sample Data" for quick testing
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {selectedModel.inputs.map((input) => (
                    <div key={input.name} className="space-y-1">
                      <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
                        {input.label}
                      </label>
                      {input.type === 'select' ? (
                        <select
                          id={input.name}
                          name={input.name}
                          value={predictionInput[input.name] || ''}
                          onChange={handleInputChange}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select {input.label}</option>
                          {input.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={input.type}
                          id={input.name}
                          name={input.name}
                          min={input.min}
                          max={input.max}
                          value={predictionInput[input.name] || ''}
                          onChange={handleInputChange}
                          className="focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder={input.type === 'number' ? `Enter a value between ${input.min || 0} and ${input.max || 'any'}` : `Enter ${input.label.toLowerCase()}`}
                        />
                      )}
                      {input.type === 'number' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Range: {input.min || 0} - {input.max || 'any'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  {!hasInputValues() && (
                    <div className="text-xs text-amber-600 mb-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Please fill in at least one parameter or use "Generate Sample Data"
                    </div>
                  )}
                  <button
                    onClick={handlePredict}
                    disabled={predicting || !hasInputValues()}
                    type="button"
                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {predicting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Run Prediction
                      </>
                    )}
                  </button>
                </div>
              </div>

              {predictionError && (
                <div className="p-5">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Prediction Failed</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{predictionError}</p>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={handlePredict}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Retry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {predictionResult && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Prediction Results</h4>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Analysis Complete
                      </span>
                      {predictionResult.fromServer ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                          </svg>
                          Server Model
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Dummy Data Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-yellow-700">
                          <strong>Reminder:</strong> This model was trained with dummy data. Results are for demonstration purposes only.
                        </p>
                      </div>
                    </div>
                  </div>

                  {(selectedModel.id === 'career-path-prediction' || predictionResult.predictions) && (
                    <div className="space-y-5">
                      {/* Model Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Model Accuracy</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.model_accuracy ? `${predictionResult.model_accuracy}%` : '95.2%'}
                          </p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Confidence</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.model_confidence ? `${predictionResult.model_confidence}%` : '87.5%'}
                          </p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Predictions</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.predictions ? predictionResult.predictions.length : '3'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
                        <h5 className="text-sm font-medium text-gray-700 mb-4">Top career paths based on your profile</h5>
                        <div className="space-y-4">
                          {predictionResult.predictions && predictionResult.predictions.map((pred, index) => (
                            <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-yellow-500'
                                  }`}></div>
                                  <span className="font-medium text-gray-800">{pred.career}</span>
                                </div>
                                <span className={`text-sm py-1 px-3 rounded-full font-medium ${
                                  pred.probability >= 0.8
                                    ? 'bg-green-100 text-green-800'
                                    : pred.probability >= 0.6
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {(pred.probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${pred.probability * 100}%` }}
                                ></div>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                {index === 0
                                  ? 'Highest match based on your profile and skills'
                                  : index === 1
                                    ? 'Good alternative career path'
                                    : 'Consider this as another option'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedModel.id === 'employment-probability-post-graduation' || predictionResult.probability) && (
                    <div className="space-y-5">
                      {/* Model Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Model Accuracy</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.model_accuracy ? `${predictionResult.model_accuracy}%` : '94.8%'}
                          </p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Confidence</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.model_confidence ? `${predictionResult.model_confidence}%` : '89.2%'}
                          </p>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-500">Factors</p>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-xl font-bold text-primary-600">
                            {predictionResult.factors ? predictionResult.factors.length : '4'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 text-center">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Employment Probability</h5>
                        <div className="relative inline-flex items-center justify-center">
                          <svg className="w-32 h-32" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200" strokeWidth="2"></circle>
                            <circle
                              cx="18"
                              cy="18"
                              r="16"
                              fill="none"
                              className="stroke-current text-primary-500"
                              strokeWidth="2"
                              strokeDasharray="100"
                              strokeDashoffset={100 - (predictionResult.probability * 100)}
                              transform="rotate(-90 18 18)"
                            ></circle>
                          </svg>
                          <div className="absolute">
                            <div className="text-3xl font-bold text-primary-600">
                              {(predictionResult.probability * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          {predictionResult.probability >= 0.8
                            ? 'Very high probability of employment after graduation'
                            : predictionResult.probability >= 0.6
                              ? 'Good probability of employment after graduation'
                              : 'Moderate probability of employment after graduation'}
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-5">
                        <h5 className="text-sm font-medium text-gray-700 mb-4">Key factors affecting this prediction</h5>
                        <ul className="space-y-3">
                          {predictionResult.factors && predictionResult.factors.map((factor, index) => (
                            <li key={index} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow duration-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium text-gray-800">{factor.name}</div>
                                  {factor.weight && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Contributes {factor.weight}% to the prediction
                                    </div>
                                  )}
                                </div>
                                <span className={`text-xs py-1 px-2 rounded-full font-medium ${
                                  factor.impact === 'High'
                                    ? 'bg-green-100 text-green-800'
                                    : factor.impact === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {factor.impact} Impact
                                </span>
                              </div>
                              {factor.weight && (
                                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      factor.impact === 'High'
                                        ? 'bg-green-500'
                                        : factor.impact === 'Medium'
                                          ? 'bg-yellow-500'
                                          : 'bg-gray-500'
                                    }`}
                                    style={{ width: `${factor.weight}%` }}
                                  ></div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-8 flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="bg-primary-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Select a Prediction Model</h3>
                <p className="text-gray-500 mb-6">Choose a model from the list to analyze alumni data and generate predictions</p>
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Available Models
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Career Path Prediction - Predicts potential career paths based on degree and skills
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Employment Probability - Predicts the likelihood of employment after graduation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Models;