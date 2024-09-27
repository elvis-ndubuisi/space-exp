export interface Launch {
  id: string;
  mission_name: string;
  launch_date_local: string;
  rocket: {
    rocket_name: string;
    rocket_type: string;
  };
  launch_site?: {
    site_name_long: string;
  };
  details?: string;
  links: {
    article_link?: string;
    video_link?: string;
    wikipedia?: string;
  };
}

export interface LaunchesData {
  launches: Launch[];
}

export interface LaunchesVars {
  limit: number;
}

export interface LaunchDetailsData {
  launch: Launch;
}

export interface LaunchDetailsVars {
  id: string;
}
