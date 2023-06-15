import { Injectable } from '@angular/core';
import { FeaturedProject } from './featured.model';

@Injectable()
export class FeaturedService {
  private simulations = {
    title: 'Browse Simulations',
    image: 'https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg',
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
    routingLink: 'https://biosimulations.dev/projects',
    logo: 'simulators',
  };
  private runSimulations = {
    title: 'Run Simulations',
    image: `https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg`,
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
    routingLink: 'https://biosimulations.dev/runs/new',
    logo: 'experiment',
  };
  private publishSimulations = {
    title: 'Submit Your Simulation for publication',
    image: `https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg`,
    id: 'publishSimulations',
    descriptionTeaser: 'Take the Stage with Publish Simulations.',
    descriptionVerbose: `Elevate your work from the lab to the limelight with our Publish Simulations feature. \
      Take your self-curated simulations and transform them into published studies, open for the world to \
      see, learn from, and build upon. Publish Simulations is more than just a tool - it’s your doorway \
      to sharing knowledge and contributing to the global bio-simulation community. With an intuitive \
      submission process, it takes only a few steps to submit your simulation for review and potential \
      publication. Your work deserves recognition. Let Publish Simulations spotlight your efforts and \
      turn your insights into shared knowledge. The future of biosimulation research is collaborative - \
      play your part with Publish Simulations.`,
    routingLink: 'https://biosimulations.dev/utils/create-project',
    logo: 'publish',
  };
  private learnSimulations = {
    title: 'Learn',
    image: `https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg`,
    id: 'learnSimulations',
    descriptionTeaser: 'Unleash Your Potential with Learn',
    descriptionVerbose: `Feed your curiosity, hone your skills, and dive deeper into the world of bio-simulation \
      with our ‘Learn’ platform. Here, knowledge and innovation unite to bring you the tools you need to \
      thrive in this ever-evolving field. The ‘Learn’ section is a comprehensive guide that makes mastering \
      bio-simulation both enjoyable and achievable. With a wealth of tutorials, you can easily navigate \
      from the basics to the more advanced concepts at your own pace. Whether you’re a budding scientist \
      or a seasoned researcher, 'Learn' provides a rich and interactive learning environment, designed \
      to support and challenge you. Take a leap into the future of bio-simulation with ‘Learn’. Your journey \
      towards mastery begins here.`,
    routingLink: `
      https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg
    `,
    logo: 'idea',
  };
  private convertFile = {
    title: 'Convert a file',
    image: 'https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg',
    id: 'convertFile',
    descriptionTeaser: 'Bridging the Gap with "BioConvert" File Conversion.',
    descriptionVerbose: `Our File Conversion feature seamlessly connects the output of your SED-ML reports to the inputs of Vega datasets.
      It is your effortless solution to linking diverse platforms and ensuring a smooth workflow. This conversion tool puts
      you in control, effortlessly transforming data outputs into compatible inputs for clear, efficient analysis.
      With this feature, the complex becomes simple. Streamline your research process and accelerate your journey to
      discovery with our BioConvert File Conversion tool.`,
    routingLink: 'https://biosimulations.dev/utils/convert-file',
    logo: 'link',
  };
  private community = {
    title: 'Community',
    image: `https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg`,
    id: 'community',
    descriptionTeaser: 'BioBuilding Community',
    descriptionVerbose: `The strength of our \
      community is integral to our mission. We're proud to partner with innovative platforms like vivarium.org, \
      allowing users to chain together BioSimulations for a more comprehensive and connected experience. Our \
      Community is a network of minds, constantly evolving, innovating, and pushing the boundaries of what's \
      possible in biological simulation.`,
    routingLink: 'https://vivarium-collective.github.io',
    logo: 'idea',
  };
  private runCustomizedSimulation = {
    title: 'Run a customized simulation',
    image: 'https://t4.ftcdn.net/jpg/05/06/41/89/360_F_506418953_5R5MQsN4UJ4hLgqnKlltS44wbQ33LhIU.jpg',
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
  };

  public projects = [
    this.simulations,
    this.runSimulations,
    this.publishSimulations,
    this.learnSimulations,
    this.convertFile,
    this.community,
    this.runCustomizedSimulation,
  ];

  private getFeature(i: number): FeaturedProject {
    return this.projects[i];
  }

  public getProjects(): FeaturedProject[] {
    return this.projects;
  }
}
