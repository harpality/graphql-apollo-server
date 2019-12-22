const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  async getAllLaunches() {
    // this.get makes a GET request to https://api.spacexdata.com/v2/launches
    // stores this in response variable
    const response = await this.get('launches');
    //checks if response is an array
    //if true, map it into launchReducer
    //if false, return empty
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  launchReducer(launch) {
    //shaping the REST dats into type object for graphql query
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type
      }
    };
  }
}

module.exports = LaunchAPI;
