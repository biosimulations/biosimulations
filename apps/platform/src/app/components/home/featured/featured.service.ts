import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private simulations = {
    title: 'Browse Simulations',
    image: 'https://img.freepik.com/premium-vector/black-white-drawing-microscope-with-microscope-it_666729-1282.jpg',
    id: 'simulations',
    descriptionTeaser: 'Explore Biology Like Never Before with BioSimDB.',
    descriptionVerbose: `Step into the fascinating world of BioSimDB, where biological simulations become a gateway \
      to in-depth understanding and exploration. BioSimDB, our comprehensive simulations database, takes you beyond \
      traditional static data, offering a dynamic, interactive journey through a wealth of biological processes. Each \
      simulation in our database unfolds as a unique profile, carefully crafted to deliver a visually compelling \
      narrative. This includes highly detailed visualizations and comprehensive data summaries. This rich profile \
      helps you gain a holistic understanding of the simulation, emphasizing key outputs and making complex data \
      more accessible and engaging. Our innovative BioCard encapsulates this ethos of clarity and interactivity. It \
      seamlessly incorporates all the critical data about each simulation. The BioCard presents four pillars of \
      output data - compelling visualizations, downloadable files for offline study, metadata for the inquisitive \
      mind, and a bespoke rerun simulation function, an exciting feature currently under development. BioSimDB is \
      more than just a database. It is a comprehensive tool designed for an immersive learning experience. Its \
      intuitive design and user-friendly interface make exploring biology a rewarding journey, irrespective of your \
      prior knowledge or experience. With BioSimDB, every simulation becomes an opportunity to explore, learn, and \
      innovate.`,
    routingLink: ['/projects'],
    logo: 'simulators',
    headerColor: 'rgb(33, 150, 243)',
    color: 'rgba(33, 150, 243, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private runSimulations = {
    title: 'Run Simulations',
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/008/017/927/small/illustration-of-people-running-icon-flat-design-free-vector.jpg',
    id: 'runSimulations',
    descriptionTeaser: 'Unlock Biological Insights with Run Simulations.',
    descriptionVerbose: `Unleash the power of personalization with Run Simulations, our dedicated tool for running \
      your own biological simulations. The Run Simulations feature brings cutting-edge technology to your fingertips, \
      enabling you to upload your own .omex files and seamlessly run simulations in real-time. The Run Simulations tool \
      is built with an emphasis on usability and flexibility. Upload your own .omex files in just a few clicks, and our \
      intuitive platform handles the rest. The tool swiftly processes your file and delivers accurate simulations, \
      offering a unique blend of speed, accuracy, and reliability. But the journey doesn't end there. With each \
      simulation you run, you gain access to comprehensive data outputs, all presented in an easily digestible format. \
      Download your results, delve into the rich metadata, or explore visual representations of your simulation for \
      deeper insights. Run Simulations is not merely a tool - it's a platform where users can experiment, test \
      hypotheses, and push the boundaries of their understanding. It fosters an environment where innovation \
      flourishes, empowering you to bring your biological questions to the forefront, explore hypotheses, and discover \
      breakthrough insights. Your biological exploration is now at your command with Run Simulations.`,
    routingLink: ['/runs/new'],
    logo: 'experiment',
    headerColor: 'rgb(255, 152, 0)',
    color: 'rgba(255, 152, 0, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private publishSimulations = {
    title: 'Submit Your Simulation for publication',
    image: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpy6yf5KdrcU3NpXPlno0_CUnI34BpdWKEjA&usqp=CAU`,
    id: 'publishSimulations',
    descriptionTeaser: 'Take the Stage and Publish a Simulation.',
    descriptionVerbose: `Elevate your work from the lab to the limelight with our Publish Simulations feature. \
      Take your self-curated simulations and transform them into published studies, open for the world to \
      see, learn from, and build upon. Publish Simulations is more than just a tool - it's your doorway \
      to sharing knowledge and contributing to the global bio-simulation community. With an intuitive \
      submission process, it takes only a few steps to submit your simulation for review and potential \
      publication. Your work deserves recognition. Let Publish Simulations spotlight your efforts and \
      turn your insights into shared knowledge. The future of biosimulation research is collaborative - \
      play your part with Publish Simulations.`,
    routingLink: ['/utils/create-project'],
    logo: 'publish',
    headerColor: 'rgb(0, 128, 0)',
    color: 'rgba(0, 128, 0, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
    mobileTitle: 'Submit for Publication',
  };
  private learnSimulations = {
    title: 'Learn',
    image: `https://neurosciencenews.com/files/2018/11/memory-learning-rna-neurosciencenews-public.jpg`,
    id: 'learnSimulations',
    descriptionTeaser: 'Step Into the Docs.',
    descriptionVerbose: `Feed your curiosity, hone your skills, and dive deeper into the world of bio-simulation \
      with our Learn platform. Here, knowledge and innovation unite to bring you the tools you need to \
      thrive in this ever-evolving field. The Learn section is a comprehensive guide that makes mastering \
      bio-simulation both enjoyable and achievable. With a wealth of tutorials, you can easily navigate \
      from the basics to the more advanced concepts at your own pace. Whether you're a budding scientist \
      or a seasoned researcher, 'Learn' provides a rich and interactive learning environment, designed \
      to support and challenge you. Take a leap into the future of bio-simulation with Learn. Your journey \
      towards mastery begins here. Image by rawpixel.com</a> on Freepik`,
    routingLink: 'https://docs.biosimulations.org/developers/setup/getting-started/',
    logo: 'idea',
    color: 'rgba(149, 30, 217, 0.85)',
    headerColor: 'rgb(0, 150, 136)',
    textColor: 'white',
  };
  private convertFile = {
    title: 'Convert a file',
    image: 'https://www.oldbookillustrations.com/site/assets/high-res/n-d-1884/edisons-electric-pen-1200.jpg',
    id: 'convertFile',
    descriptionTeaser: 'Bridging the Gap with "BioConvert" File Conversion.',
    descriptionVerbose: `Our File Conversion feature seamlessly connects the output of your SED-ML reports to the inputs of Vega datasets.
      It is your effortless solution to linking diverse platforms and ensuring a smooth workflow. This conversion tool puts
      you in control, effortlessly transforming data outputs into compatible inputs for clear, efficient analysis.
      With this feature, the complex becomes simple. Streamline your research process and accelerate your journey to
      discovery with our BioConvert File Conversion tool.`,
    routingLink: ['/utils/convert-file'],
    logo: 'link',
    headerColor: 'rgb(144, 67, 54)',
    color: 'rgba(244, 67, 54, 0.85)',
    textColor: 'white',
    useInternalRouting: true,
  };
  private community = {
    title: 'Community',
    image:
      'https://images.unsplash.com/photo-1500042600524-37ecb686c775?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    id: 'community',
    descriptionTeaser: 'Our Community',
    descriptionVerbose: `The strength of our \
      community is integral to our mission. We're proud to partner with innovative platforms like vivarium.org, \
      allowing users to chain together BioSimulations for a more comprehensive and connected experience. Our \
      Community is a network of minds, constantly evolving, innovating, and pushing the boundaries of what's \
      possible in biological simulation.`,
    routingLink: 'https://vivarium-collective.github.io',
    logo: 'idea',
    headerColor: 'rgb(149, 30, 217)',
    color: 'rgba(0, 150, 136, 0.85)',
    textColor: 'white',
  };
  /*private runCustomizedSimulation = {
    title: 'Run a customized simulation',
    image: `https://images.rawpixel.com/image_1300 \
       /czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvcGQ0My0wNjA0LTA2Ni1uYW1fMC5qcGc.jpg`,
    id: 'runCustomizedSimulation',
    descriptionTeaser: 'Tailor-Made Discoveries with Run a Customized Simulation',
    descriptionVerbose: `Venture into \
      uncharted territories with our Run a Customized Simulation feature. This tool gives you the ability to \
      tweak existing simulations, run them anew, and garner unique results based on your parameters. Let curiosity \
      be your guide as you navigate through the rich tapestry of biological data and explore your custom scenarios \
      with 'Run a Customized Simulation'. We will start you off with the project \
      "Mouse Iron distribution(Parmar et al., BMC Syst Biol, 2017)".`,
    routingLink: `
       https://run.biosimulations.org/runs/new \
       ?projectUrl=https:%2F%2Fapi.biosimulations.org%2Fruns%2F61fea49049420059835774e3%2Fdownload \
       &simulator=pysces&simulatorVersion=1.0.0\
       &runName=Iron%20distribution%20(Parmar%20et%20al.,%20BMC%20Syst%20Biol,%202017;%20SBML;%20CVODE;%20PySCeS)%20(rerun)
      `,
    logo: 'experiment',
    headerColor: 'green',
    color: 'green',
    textColor: 'white',
  };*/

  public projects = [
    this.simulations,
    this.runSimulations,
    this.publishSimulations,
    this.learnSimulations,
    this.convertFile,
    this.community,
    //this.runCustomizedSimulation,
  ];

  private getSingleProject(i: number): FeaturedProject {
    return this.projects[i];
  }

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
