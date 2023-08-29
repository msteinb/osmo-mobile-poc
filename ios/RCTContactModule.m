//
//  RCTContactModule.m
//  OsmosisMobile
//
//  Created by Moshe Steinberg on 29/08/2023.
//

#import "RCTContactModule.h"

#import <React/RCTLog.h>
#import <Contacts/Contacts.h>

@implementation RCTContactModule
	
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(getContactsByName:(NSString *)name callback:(RCTResponseSenderBlock)callback) {
  RCTLogInfo(@"will request contacts for %@", name);
  
  CNContactFetchRequest *request = [[CNContactFetchRequest alloc] initWithKeysToFetch:(@[
    CNContactGivenNameKey,
    CNContactFamilyNameKey,
    CNContactPhoneNumbersKey
  ])];
  request.predicate = [CNContact predicateForContactsMatchingName:name];
  
  NSMutableArray *contacts = [[NSMutableArray alloc] init];
  NSError *error = nil;
  BOOL success = [[[CNContactStore alloc] init]
    enumerateContactsWithFetchRequest:request
    error:&error
    usingBlock:^(CNContact * _Nonnull contact, BOOL * _Nonnull stop)
  {
    [contacts addObject:[NSString stringWithFormat:@"%@ %@", contact.givenName, contact.familyName]];
  }];
  
  if (error == nil) {
    callback(@[contacts]);
  } else {
    //todo handle error
    RCTLogInfo(@"error fetching contacts, %@", error);
  }
  
  RCTLogInfo(@"success: %d, error: %@", success, error);
}

@end
