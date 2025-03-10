
export interface Concept {
  id: string;
  title: string;
  description: string;
  level: number;
  position: number;
  childrenIds: string[];
  parentIds: string[];
  content: string;
  tags: string[];
}

// This creates a hierarchical pyramid of concepts for LLMs
export const llmConcepts: Concept[] = [
  // Level 1 - Top of pyramid
  {
    id: "llm",
    title: "Large Language Models",
    description: "AI systems trained on vast text data that can understand and generate human language",
    level: 1,
    position: 1,
    childrenIds: ["neural-networks", "deep-learning", "nlp"],
    parentIds: [],
    content: "Large Language Models (LLMs) are advanced AI systems trained on vast amounts of text data. They can understand context, generate human-like text, translate languages, and answer questions. They represent a significant advancement in artificial intelligence, particularly in natural language processing.",
    tags: ["AI", "NLP", "Foundation"]
  },
  
  // Level 2
  {
    id: "neural-networks",
    title: "Neural Networks",
    description: "Computing systems inspired by the human brain's structure and function",
    level: 2,
    position: 1,
    childrenIds: ["neurons", "weights", "activation-functions"],
    parentIds: ["llm"],
    content: "Neural networks are computing systems inspired by the biological neural networks in animal brains. They consist of artificial neurons that transmit signals to each other. The connections between neurons have weights that adjust as learning proceeds, allowing the network to learn from data and make predictions.",
    tags: ["Machine Learning", "Mathematics"]
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    description: "Machine learning methods based on artificial neural networks with multiple layers",
    level: 2,
    position: 2,
    childrenIds: ["backpropagation", "gradient-descent", "layers"],
    parentIds: ["llm"],
    content: "Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks). These networks can learn complex patterns in large amounts of data, making them effective for tasks like image and speech recognition, natural language processing, and more.",
    tags: ["Machine Learning", "Mathematics"]
  },
  {
    id: "nlp",
    title: "Natural Language Processing",
    description: "The ability of computers to understand and generate human language",
    level: 2,
    position: 3,
    childrenIds: ["tokenization", "embeddings", "attention-mechanisms"],
    parentIds: ["llm"],
    content: "Natural Language Processing (NLP) combines computational linguistics, machine learning, and deep learning to enable computers to process, understand, and generate human language. NLP powers applications like machine translation, sentiment analysis, and language generation.",
    tags: ["Linguistics", "Computer Science"]
  },
  
  // Level 3
  {
    id: "neurons",
    title: "Artificial Neurons",
    description: "Basic computational units of neural networks",
    level: 3,
    position: 1,
    childrenIds: ["perceptron"],
    parentIds: ["neural-networks"],
    content: "Artificial neurons are the fundamental units of neural networks, loosely modeled after biological neurons. Each artificial neuron receives input signals, processes them, and produces an output signal. This process involves weighted inputs, a summation function, and an activation function.",
    tags: ["Biology", "Mathematics"]
  },
  {
    id: "weights",
    title: "Weights & Biases",
    description: "Parameters that control the strength of connections between neurons",
    level: 3,
    position: 2,
    childrenIds: ["parameter-optimization"],
    parentIds: ["neural-networks"],
    content: "Weights and biases are the learnable parameters of neural networks. Weights determine the strength of connections between neurons, while biases allow neurons to activate even when inputs are zero. Through training, these parameters are adjusted to minimize prediction errors.",
    tags: ["Mathematics", "Optimization"]
  },
  {
    id: "activation-functions",
    title: "Activation Functions",
    description: "Functions that determine the output of a neuron based on its inputs",
    level: 3,
    position: 3,
    childrenIds: ["sigmoid", "relu"],
    parentIds: ["neural-networks"],
    content: "Activation functions determine whether a neuron should be activated based on its weighted input. They introduce non-linearity into neural networks, allowing them to learn complex patterns. Common activation functions include ReLU, sigmoid, and tanh.",
    tags: ["Mathematics", "Computer Science"]
  },
  {
    id: "backpropagation",
    title: "Backpropagation",
    description: "Algorithm for training neural networks by adjusting weights based on error",
    level: 3,
    position: 4,
    childrenIds: ["chain-rule"],
    parentIds: ["deep-learning"],
    content: "Backpropagation is an algorithm used to train neural networks. It calculates the gradient of the loss function with respect to each weight, then uses gradient descent to update the weights in a way that minimizes the loss function. This process enables neural networks to learn from their mistakes.",
    tags: ["Mathematics", "Optimization"]
  },
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    description: "Optimization algorithm for finding the minimum of a function",
    level: 3,
    position: 5,
    childrenIds: ["learning-rate"],
    parentIds: ["deep-learning"],
    content: "Gradient descent is an optimization algorithm used to minimize the loss function in machine learning models. It works by iteratively adjusting parameters in the direction of steepest descent of the loss function. There are variations like stochastic gradient descent and mini-batch gradient descent.",
    tags: ["Mathematics", "Optimization"]
  },
  {
    id: "layers",
    title: "Neural Network Layers",
    description: "Groups of neurons that process specific aspects of data",
    level: 3,
    position: 6,
    childrenIds: ["hidden-layers"],
    parentIds: ["deep-learning"],
    content: "Neural networks are organized into layers of neurons. The input layer receives data, hidden layers process it, and the output layer produces the final result. Different layer types like convolutional, recurrent, and transformer layers are specialized for specific tasks.",
    tags: ["Architecture", "Computer Science"]
  },
  {
    id: "tokenization",
    title: "Tokenization",
    description: "Process of converting text into smaller units for processing",
    level: 3,
    position: 7,
    childrenIds: ["subword-tokenization"],
    parentIds: ["nlp"],
    content: "Tokenization is the process of breaking text into smaller units called tokens, which can be words, characters, or subwords. It's a fundamental preprocessing step in NLP that converts raw text into a format that can be processed by machine learning algorithms.",
    tags: ["Linguistics", "Preprocessing"]
  },
  {
    id: "embeddings",
    title: "Word Embeddings",
    description: "Vector representations of words that capture semantic meaning",
    level: 3,
    position: 8,
    childrenIds: ["word2vec", "glove"],
    parentIds: ["nlp"],
    content: "Word embeddings are dense vector representations of words in a high-dimensional space. They capture semantic relationships between words, allowing similar words to have similar vectors. Techniques like Word2Vec, GloVe, and FastText are used to create word embeddings.",
    tags: ["Linguistics", "Representation Learning"]
  },
  {
    id: "attention-mechanisms",
    title: "Attention Mechanisms",
    description: "Techniques that allow models to focus on specific parts of input data",
    level: 3,
    position: 9,
    childrenIds: ["self-attention", "transformers"],
    parentIds: ["nlp"],
    content: "Attention mechanisms allow neural networks to focus on specific parts of input data when making predictions. In NLP, attention enables models to consider the relationships between words regardless of their positions in a sequence. This breakthrough has led to more effective language models.",
    tags: ["Architecture", "Innovation"]
  },
  
  // Level 4 - just a few examples, you could expand this further
  {
    id: "perceptron",
    title: "Perceptron",
    description: "The simplest type of artificial neuron",
    level: 4,
    position: 1,
    childrenIds: [],
    parentIds: ["neurons"],
    content: "The perceptron is the simplest form of neural network, consisting of a single artificial neuron. It takes several binary inputs, multiplies each by a weight, sums them, and outputs 1 if the sum exceeds a threshold, otherwise 0. Despite its simplicity, it can learn to classify linearly separable patterns.",
    tags: ["History", "Foundations"]
  },
  {
    id: "sigmoid",
    title: "Sigmoid Function",
    description: "S-shaped function that transforms values to range between 0 and 1",
    level: 4,
    position: 2,
    childrenIds: [],
    parentIds: ["activation-functions"],
    content: "The sigmoid function (logistic function) maps any input value to a value between 0 and 1. It's useful for models where we need to predict probability as an output. However, it suffers from the vanishing gradient problem, limiting its use in deep networks.",
    tags: ["Mathematics", "Function"]
  },
  {
    id: "relu",
    title: "ReLU Function",
    description: "Activation function that outputs the input for positive values, and zero otherwise",
    level: 4,
    position: 3,
    childrenIds: [],
    parentIds: ["activation-functions"],
    content: "ReLU (Rectified Linear Unit) is an activation function that outputs the input directly if it's positive, otherwise it outputs zero. It's computationally efficient and helps solve the vanishing gradient problem, making it popular in deep learning.",
    tags: ["Mathematics", "Function"]
  },
  {
    id: "chain-rule",
    title: "Chain Rule",
    description: "Mathematical rule for computing the derivative of composite functions",
    level: 4,
    position: 4,
    childrenIds: [],
    parentIds: ["backpropagation"],
    content: "The chain rule is a formula for computing the derivative of composite functions. In backpropagation, it's used to calculate how changes in the network's parameters affect the loss function, enabling the network to learn by adjusting these parameters.",
    tags: ["Calculus", "Mathematics"]
  },
  {
    id: "self-attention",
    title: "Self-Attention",
    description: "Attention mechanism that relates different positions in a sequence",
    level: 4,
    position: 5,
    childrenIds: [],
    parentIds: ["attention-mechanisms"],
    content: "Self-attention is a mechanism that allows a model to weigh the importance of different words in a sequence when processing a specific word. It enables the model to consider context from the entire sequence, regardless of distance, improving performance on long-range dependencies.",
    tags: ["Architecture", "Innovation"]
  },
  {
    id: "transformers",
    title: "Transformer Architecture",
    description: "Neural network architecture based on self-attention mechanisms",
    level: 4,
    position: 6,
    childrenIds: [],
    parentIds: ["attention-mechanisms"],
    content: "The Transformer is a neural network architecture that relies entirely on self-attention mechanisms to draw global dependencies between input and output. It has revolutionized NLP by enabling more effective learning of long-range dependencies and facilitating parallel processing.",
    tags: ["Architecture", "Innovation"]
  }
];

// Helper function to get concept by ID
export const getConceptById = (id: string): Concept | undefined => {
  return llmConcepts.find(concept => concept.id === id);
};

// Helper function to get all concepts for a specific level
export const getConceptsByLevel = (level: number): Concept[] => {
  return llmConcepts.filter(concept => concept.level === level);
};

// Helper function to get child concepts
export const getChildConcepts = (parentId: string): Concept[] => {
  const parent = getConceptById(parentId);
  if (!parent) return [];
  
  return parent.childrenIds.map(id => getConceptById(id)).filter(Boolean) as Concept[];
};

// Helper function to get parent concepts
export const getParentConcepts = (childId: string): Concept[] => {
  const child = getConceptById(childId);
  if (!child) return [];
  
  return child.parentIds.map(id => getConceptById(id)).filter(Boolean) as Concept[];
};
