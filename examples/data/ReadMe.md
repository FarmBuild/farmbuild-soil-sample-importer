# FarmBuild Soil Sample Importer

This is to give a high level overview of the example JSON, CSV files contained in this folder.

The JSON files contain information on a hypothetical farm called Farm12. Some of these files have paddocks, their relevant groupings and soil sample information. Some of the files contain just the basic farm data in the basic form.
The CSV file contains sample results associated with Farm12 FarmData JSON.

Below is a brief explanation of the blocks in the json file which are related to the soil sample imports example. For details of the other blocks please refer to <a href="https://github.com/FarmBuild/farmbuild-farmdata">FarmData</a>.

If the FarmData json has soil sample results associated with it there should be a top level "soils" block containing "sampleResults" block in it.
This "sampleResults" block should have a "dateLastUpdated" key. This should contain the date the soils sample results data has been last updated.
The "importFieldNames" key should have an array of all fields names. These field names should be associated with soil sample results for the paddocks.

The top level block "paddocks" should be an array of paddocks. Each array object has information on each individual paddock.
If there is soil information related to a paddock, these paddocks should have a "soil" block with "sampleResults" block in it,
This "sampleResults" should be an array. A single object in this array should be having all import field values in the sample result for that paddock.
The keys in a single object of "sampleResults", should map to the top level "soils">>"sampleResults">>"importFieldNames" values.




###farmdata-Farm12-with-soil-sample-data.json
Contains a full example of multiple paddocks and paddock groups. These paddocks and groups have already been classified based on the soil sample results they have.

###farmdata-Farm12.json
Example JSON containing paddocks without any soil sample information. Paddocks has been grouped in to paddockGroups. Does not contain any soils block in it. If this file is loaded through the example it will contain a blank soils block.

###farmdata-new.json
Contains an example JSON with only the paddocks.

###farmdata-susan-with-sample.json
Is an example JSON file having only two paddocks and paddock groups

###Farm12-soil-results.csv
Contains the soils sample CSV file.