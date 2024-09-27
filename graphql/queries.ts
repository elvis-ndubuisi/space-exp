import { gql } from "@apollo/client";

export const GET_LAUNCHES = gql`
  query GetLaunches($limit: Int!) {
    launches(limit: $limit) {
      id
      mission_name
      launch_date_local
      rocket {
        rocket_name
      }
      launch_site {
        site_name_long
      }
    }
  }
`;

export const GET_LAUNCH_DETAILS = gql`
  query GetLaunchDetails($id: ID!) {
    launch(id: $id) {
      id
      mission_name
      launch_date_local
      rocket {
        rocket_name
        rocket_type
      }
      launch_site {
        site_name_long
      }
      details
      links {
        article_link
        video_link
        wikipedia
      }
    }
  }
`;
